/**
 * Advanced Authentication Service
 * خدمة المصادقة المتقدمة
 * 
 * Comprehensive authentication and user management system
 * نظام شامل للمصادقة وإدارة المستخدمين
 */

import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Types and Interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: string[];
  avatarUrl?: string;
  phone?: string;
  language: string;
  timezone: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  emailVerified: boolean;
  preferences: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

export interface LoginCredentials {
  username: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  permissions?: string[];
}

export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  location?: Record<string, any>;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
}

export interface PasswordResetRequest {
  email: string;
  token: string;
  expiresAt: Date;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

// Authentication Service Class
export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private currentSession: Session | null = null;
  
  // Session management
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  private readonly REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize authentication system
   * تهيئة نظام المصادقة
   */
  private async initializeAuth(): Promise<void> {
    try {
      const sessionToken = this.getStoredSessionToken();
      if (sessionToken) {
        await this.validateSession(sessionToken);
      }
      
      // Setup session refresh interval
      setInterval(() => {
        this.refreshCurrentSession();
      }, 5 * 60 * 1000); // Every 5 minutes
      
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  }

  /**
   * Login with credentials
   * تسجيل الدخول بالبيانات
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; session: Session; requiresTwoFactor?: boolean }> {
    try {
      // Input validation
      if (!credentials.username || !credentials.password) {
        throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
      }

      // Get user by username or email
      const user = await this.getUserByUsernameOrEmail(credentials.username);
      if (!user) {
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        throw new Error(`الحساب مقفل. المحاولة مرة أخرى خلال ${remainingMinutes} دقيقة`);
      }

      // Check if account is active
      if (!user.isActive) {
        throw new Error('الحساب غير نشط. تواصل مع المدير');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(credentials.password, user);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user);
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      // Check two-factor authentication
      if (user.twoFactorEnabled) {
        if (!credentials.twoFactorCode) {
          return { 
            user, 
            session: null as any, 
            requiresTwoFactor: true 
          };
        }
        
        const isTwoFactorValid = await this.verifyTwoFactorCode(user.id, credentials.twoFactorCode);
        if (!isTwoFactorValid) {
          throw new Error('رمز التحقق ث��ائي العامل غير صحيح');
        }
      }

      // Reset login attempts on successful login
      await this.resetLoginAttempts(user.id);

      // Create session
      const session = await this.createSession(user, {
        rememberMe: credentials.rememberMe,
        ipAddress: this.getClientIP(),
        userAgent: navigator.userAgent,
        deviceType: this.getDeviceType(),
      });

      // Update last login
      await this.updateLastLogin(user.id);

      // Set current user and session
      this.currentUser = user;
      this.currentSession = session;

      // Store session token
      this.storeSessionToken(session.sessionToken, credentials.rememberMe);

      // Log successful login
      await this.logActivity('user_login', { userId: user.id, sessionId: session.id });

      return { user, session };

    } catch (error) {
      await this.logActivity('login_failed', { 
        username: credentials.username, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Register new user
   * تسجيل مستخدم جديد
   */
  async register(userData: RegisterData): Promise<User> {
    try {
      // Validate input
      await this.validateRegistrationData(userData);

      // Check if username/email already exists
      const existingUser = await this.getUserByUsernameOrEmail(userData.username) || 
                          await this.getUserByUsernameOrEmail(userData.email);
      
      if (existingUser) {
        throw new Error('اسم المستخدم أو البريد الإلكتروني موجود بالفعل');
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password);

      // Generate email verification token
      const emailVerificationToken = uuidv4();

      // Create user
      const newUser: Partial<User> = {
        id: uuidv4(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || 'viewer',
        permissions: userData.permissions || [],
        language: 'ar',
        timezone: 'UTC',
        isActive: true,
        twoFactorEnabled: false,
        loginAttempts: 0,
        emailVerified: false,
        preferences: {},
        metadata: { emailVerificationToken },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to database
      if (supabase) {
        const { data, error } = await supabase
          .from('admin_users')
          .insert({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            password_hash: passwordHash,
            full_name: newUser.fullName,
            role: newUser.role,
            permissions: newUser.permissions,
            language: newUser.language,
            timezone: newUser.timezone,
            is_active: newUser.isActive,
            two_factor_enabled: newUser.twoFactorEnabled,
            login_attempts: newUser.loginAttempts,
            email_verified: newUser.emailVerified,
            email_verification_token: emailVerificationToken,
            preferences: newUser.preferences,
            metadata: newUser.metadata,
          })
          .select()
          .single();

        if (error) throw error;
        
        const user = this.mapUserFromDB(data);
        
        // Send verification email
        await this.sendVerificationEmail(user.email, emailVerificationToken);
        
        // Log user creation
        await this.logActivity('user_registered', { userId: user.id, email: user.email });
        
        return user;
      } else {
        // Fallback to localStorage
        const users = this.getStoredUsers();
        const user = { ...newUser, passwordHash } as User & { passwordHash: string };
        users.push(user);
        localStorage.setItem('kyctrust_users', JSON.stringify(users));
        
        return user as User;
      }

    } catch (error) {
      await this.logActivity('registration_failed', { 
        email: userData.email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Logout current user
   * تسجيل خروج المستخدم الحالي
   */
  async logout(): Promise<void> {
    try {
      if (this.currentSession) {
        // Invalidate session in database
        await this.invalidateSession(this.currentSession.id);
        
        // Log logout
        await this.logActivity('user_logout', { 
          userId: this.currentUser?.id, 
          sessionId: this.currentSession.id 
        });
      }

      // Clear local state
      this.currentUser = null;
      this.currentSession = null;
      
      // Remove stored tokens
      this.removeStoredTokens();

    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current authenticated user
   * الحصول على المستخدم المصادق حاليا
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current session
   * الحصول على الجلسة الحالية
   */
  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  /**
   * Check if user is authenticated
   * التحقق من مصادقة المستخدم
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentSession !== null;
  }

  /**
   * Check if user has permission
   * التحقق من صلاحية المستخدم
   */
  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    
    // Super admin has all permissions
    if (this.currentUser.role === 'super_admin') return true;
    
    return this.currentUser.permissions.includes(permission);
  }

  /**
   * Change user password
   * تغيير كلمة مرور المستخدم
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user);
      if (!isCurrentPasswordValid) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
      }

      // Validate new password
      this.validatePassword(newPassword);

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password in database
      if (supabase) {
        const { error } = await supabase
          .from('admin_users')
          .update({ 
            password_hash: newPasswordHash,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
      } else {
        // Update in localStorage
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          (users[userIndex] as any).passwordHash = newPasswordHash;
          localStorage.setItem('kyctrust_users', JSON.stringify(users));
        }
      }

      // Log password change
      await this.logActivity('password_changed', { userId });

      // Invalidate all other sessions for this user
      await this.invalidateUserSessions(userId, this.currentSession?.id);

    } catch (error) {
      await this.logActivity('password_change_failed', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Setup two-factor authentication
   * إعداد المص��دقة ثنائية العامل
   */
  async setupTwoFactor(userId: string): Promise<TwoFactorSetup> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // Generate secret
      const secret = this.generateTwoFactorSecret();
      
      // Generate QR code
      const qrCode = await this.generateTwoFactorQR(user.email, secret);
      
      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Store secret (but don't enable 2FA yet)
      await this.storeTwoFactorSecret(userId, secret);

      return { secret, qrCode, backupCodes };

    } catch (error) {
      console.error('Two-factor setup error:', error);
      throw error;
    }
  }

  /**
   * Enable two-factor authentication
   * تفعيل المصادقة ثنائية العامل
   */
  async enableTwoFactor(userId: string, verificationCode: string): Promise<void> {
    try {
      // Verify the code
      const isCodeValid = await this.verifyTwoFactorCode(userId, verificationCode);
      if (!isCodeValid) {
        throw new Error('رمز التحقق غير صحيح');
      }

      // Enable 2FA
      if (supabase) {
        const { error } = await supabase
          .from('admin_users')
          .update({ 
            two_factor_enabled: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
      }

      // Update current user if it's the same user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser.twoFactorEnabled = true;
      }

      // Log 2FA enabled
      await this.logActivity('two_factor_enabled', { userId });

    } catch (error) {
      await this.logActivity('two_factor_enable_failed', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Disable two-factor authentication
   * إلغاء تفعيل المصادقة ثنائية العامل
   */
  async disableTwoFactor(userId: string, password: string): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(password, user);
      if (!isPasswordValid) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      // Disable 2FA
      if (supabase) {
        const { error } = await supabase
          .from('admin_users')
          .update({ 
            two_factor_enabled: false,
            two_factor_secret: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;
      }

      // Update current user if it's the same user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser.twoFactorEnabled = false;
      }

      // Log 2FA disabled
      await this.logActivity('two_factor_disabled', { userId });

    } catch (error) {
      await this.logActivity('two_factor_disable_failed', { 
        userId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Request password reset
   * طلب إعادة تعيين كلمة المرور
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await this.getUserByUsernameOrEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return;
      }

      // Generate reset token
      const resetToken = uuidv4();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset token
      if (supabase) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            password_reset_token: resetToken,
            password_reset_expires: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      // Send reset email
      await this.sendPasswordResetEmail(user.email, resetToken);

      // Log password reset request
      await this.logActivity('password_reset_requested', { userId: user.id, email: user.email });

    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * إعادة تعيين كلمة المرور بالرمز المميز
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Find user by reset token
      let user: User | null = null;
      
      if (supabase) {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('password_reset_token', token)
          .gt('password_reset_expires', new Date().toISOString())
          .single();

        if (error || !data) {
          throw new Error('رمز إعادة التعيين غير صالح أو منتهي الصلاحية');
        }

        user = this.mapUserFromDB(data);
      }

      if (!user) {
        throw new Error('رمز إعادة التعيين غير صالح أو منتهي الصلاحية');
      }

      // Validate new password
      this.validatePassword(newPassword);

      // Hash new password
      const newPasswordHash = await this.hashPassword(newPassword);

      // Update password and clear reset token
      if (supabase) {
        const { error } = await supabase
          .from('admin_users')
          .update({
            password_hash: newPasswordHash,
            password_reset_token: null,
            password_reset_expires: null,
            login_attempts: 0,
            locked_until: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      // Invalidate all sessions for this user
      await this.invalidateUserSessions(user.id);

      // Log password reset
      await this.logActivity('password_reset_completed', { userId: user.id });

    } catch (error) {
      await this.logActivity('password_reset_failed', { 
        token, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  // Private helper methods
  private async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.eq.${usernameOrEmail},email.eq.${usernameOrEmail}`)
        .single();

      if (error || !data) return null;
      return this.mapUserFromDB(data);
    } else {
      const users = this.getStoredUsers();
      return users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail) || null;
    }
  }

  private async getUserById(id: string): Promise<User | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return this.mapUserFromDB(data);
    } else {
      const users = this.getStoredUsers();
      return users.find(u => u.id === id) || null;
    }
  }

  private async verifyPassword(password: string, user: User): Promise<boolean> {
    // In real implementation, get the hashed password from the user record
    const storedHash = await this.getStoredPasswordHash(user.id);
    return bcrypt.compare(password, storedHash);
  }

  private async getStoredPasswordHash(userId: string): Promise<string> {
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (error || !data) throw new Error('Failed to get password hash');
      return data.password_hash;
    } else {
      const users = this.getStoredUsers();
      const user = users.find(u => u.id === userId) as any;
      return user?.passwordHash || '';
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }
  }

  private async validateRegistrationData(userData: RegisterData): Promise<void> {
    if (!userData.username || userData.username.length < 3) {
      throw new Error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    }
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      throw new Error('البريد الإلكتروني غير صالح');
    }
    if (!userData.fullName || userData.fullName.length < 2) {
      throw new Error('الاسم الكامل مطلوب');
    }
    this.validatePassword(userData.password);
  }

  private async handleFailedLogin(user: User): Promise<void> {
    const newAttempts = user.loginAttempts + 1;
    let updateData: any = { 
      login_attempts: newAttempts,
      updated_at: new Date().toISOString()
    };

    if (newAttempts >= this.MAX_LOGIN_ATTEMPTS) {
      updateData.locked_until = new Date(Date.now() + this.LOCKOUT_DURATION).toISOString();
    }

    if (supabase) {
      await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', user.id);
    }
  }

  private async resetLoginAttempts(userId: string): Promise<void> {
    if (supabase) {
      await supabase
        .from('admin_users')
        .update({ 
          login_attempts: 0,
          locked_until: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }
  }

  private async createSession(user: User, options: any): Promise<Session> {
    const sessionId = uuidv4();
    const sessionToken = uuidv4();
    const expiresAt = new Date(
      Date.now() + (options.rememberMe ? this.REMEMBER_ME_DURATION : this.SESSION_DURATION)
    );

    const session: Session = {
      id: sessionId,
      userId: user.id,
      sessionToken,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      deviceType: options.deviceType,
      location: options.location || {},
      isActive: true,
      expiresAt,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    if (supabase) {
      const { error } = await supabase
        .from('admin_sessions')
        .insert({
          id: session.id,
          user_id: session.userId,
          session_token: session.sessionToken,
          ip_address: session.ipAddress,
          user_agent: session.userAgent,
          device_type: session.deviceType,
          location: session.location,
          is_active: session.isActive,
          expires_at: session.expiresAt.toISOString(),
          last_activity: session.lastActivity.toISOString(),
        });

      if (error) throw error;
    } else {
      const sessions = this.getStoredSessions();
      sessions.push(session);
      localStorage.setItem('kyctrust_sessions', JSON.stringify(sessions));
    }

    return session;
  }

  private async validateSession(sessionToken: string): Promise<Session | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*, admin_users(*)')
        .eq('session_token', sessionToken)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) return null;

      const session = this.mapSessionFromDB(data);
      const user = this.mapUserFromDB(data.admin_users);

      this.currentUser = user;
      this.currentSession = session;

      return session;
    } else {
      const sessions = this.getStoredSessions();
      const session = sessions.find(s => 
        s.sessionToken === sessionToken && 
        s.isActive && 
        s.expiresAt > new Date()
      );

      if (session) {
        const users = this.getStoredUsers();
        const user = users.find(u => u.id === session.userId);
        if (user) {
          this.currentUser = user;
          this.currentSession = session;
          return session;
        }
      }
      return null;
    }
  }

  private async refreshCurrentSession(): Promise<void> {
    if (!this.currentSession) return;

    if (supabase) {
      await supabase
        .from('admin_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', this.currentSession.id);
    }

    this.currentSession.lastActivity = new Date();
  }

  private async invalidateSession(sessionId: string): Promise<void> {
    if (supabase) {
      await supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);
    } else {
      const sessions = this.getStoredSessions();
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex !== -1) {
        sessions[sessionIndex].isActive = false;
        localStorage.setItem('kyctrust_sessions', JSON.stringify(sessions));
      }
    }
  }

  private async invalidateUserSessions(userId: string, excludeSessionId?: string): Promise<void> {
    if (supabase) {
      let query = supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (excludeSessionId) {
        query = query.neq('id', excludeSessionId);
      }

      await query;
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    if (supabase) {
      await supabase
        .from('admin_users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }
  }

  private getStoredSessionToken(): string | null {
    return localStorage.getItem('kyctrust_session_token') || 
           sessionStorage.getItem('kyctrust_session_token');
  }

  private storeSessionToken(token: string, rememberMe?: boolean): void {
    if (rememberMe) {
      localStorage.setItem('kyctrust_session_token', token);
    } else {
      sessionStorage.setItem('kyctrust_session_token', token);
    }
  }

  private removeStoredTokens(): void {
    localStorage.removeItem('kyctrust_session_token');
    sessionStorage.removeItem('kyctrust_session_token');
  }

  private getStoredUsers(): User[] {
    try {
      const users = localStorage.getItem('kyctrust_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private getStoredSessions(): Session[] {
    try {
      const sessions = localStorage.getItem('kyctrust_sessions');
      return sessions ? JSON.parse(sessions) : [];
    } catch {
      return [];
    }
  }

  private mapUserFromDB(data: any): User {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      fullName: data.full_name,
      role: data.role,
      permissions: data.permissions || [],
      avatarUrl: data.avatar_url,
      phone: data.phone,
      language: data.language || 'ar',
      timezone: data.timezone || 'UTC',
      isActive: data.is_active,
      twoFactorEnabled: data.two_factor_enabled,
      lastLogin: data.last_login ? new Date(data.last_login) : undefined,
      loginAttempts: data.login_attempts || 0,
      lockedUntil: data.locked_until ? new Date(data.locked_until) : undefined,
      emailVerified: data.email_verified,
      preferences: data.preferences || {},
      metadata: data.metadata || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private mapSessionFromDB(data: any): Session {
    return {
      id: data.id,
      userId: data.user_id,
      sessionToken: data.session_token,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      deviceType: data.device_type,
      location: data.location || {},
      isActive: data.is_active,
      expiresAt: new Date(data.expires_at),
      createdAt: new Date(data.created_at),
      lastActivity: new Date(data.last_activity),
    };
  }

  private getClientIP(): string {
    // This would need to be implemented based on your setup
    return '127.0.0.1';
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private generateTwoFactorSecret(): string {
    // Generate a random 32-character secret
    return Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(36))
      .join('')
      .substring(0, 32);
  }

  private async generateTwoFactorQR(email: string, secret: string): Promise<string> {
    // In a real implementation, you would use a QR code library
    const issuer = 'KYCtrust';
    const url = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
    return `data:image/svg+xml;base64,${btoa(`<svg>QR Code for: ${url}</svg>`)}`;
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  private async storeTwoFactorSecret(userId: string, secret: string): Promise<void> {
    if (supabase) {
      await supabase
        .from('admin_users')
        .update({ two_factor_secret: secret })
        .eq('id', userId);
    }
  }

  private async verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
    // In a real implementation, you would use a TOTP library like 'otplib'
    // For now, return true for demonstration
    return code.length === 6 && /^\d+$/.test(code);
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    // In a real implementation, send actual email
    console.log(`Verification email sent to ${email} with token: ${token}`);
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // In a real implementation, send actual email
    console.log(`Password reset email sent to ${email} with token: ${token}`);
  }

  private async logActivity(activity: string, metadata: any): Promise<void> {
    try {
      if (supabase) {
        await supabase
          .from('analytics_events')
          .insert({
            event_type: activity,
            event_category: 'auth',
            user_id: this.currentUser?.id,
            session_id: this.currentSession?.id,
            metadata,
            page_url: window.location.href,
            ip_address: this.getClientIP(),
            user_agent: navigator.userAgent,
          });
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;
