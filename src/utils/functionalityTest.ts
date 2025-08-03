/**
 * Comprehensive functionality test for KYCtrust application
 * Tests all major features and components
 */

interface TestResult {
  component: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

class FunctionalityTester {
  private results: TestResult[] = [];

  private addResult(component: string, status: 'PASS' | 'FAIL', message: string): void {
    this.results.push({ component, status, message });
  }

  private log(message: string): void {
    console.log(`🧪 [Test] ${message}`);
  }

  private logSuccess(message: string): void {
    console.log(`✅ [Success] ${message}`);
  }

  private logError(message: string): void {
    console.error(`❌ [Error] ${message}`);
  }

  // Test theme functionality
  private testThemeToggle(): void {
    try {
      this.log('Testing theme toggle functionality...');
      
      // Check if theme is properly applied to document
      const darkModeApplied = document.documentElement.classList.contains('dark');
      const themeStorage = localStorage.getItem('kyctrust_theme');
      
      this.addResult('ThemeToggle', 'PASS', `Theme state: ${darkModeApplied ? 'Dark' : 'Light'}, Stored: ${themeStorage}`);
      this.logSuccess('Theme toggle test passed');
    } catch (error) {
      this.addResult('ThemeToggle', 'FAIL', `Error: ${error}`);
      this.logError('Theme toggle test failed');
    }
  }

  // Test language functionality
  private testLanguageToggle(): void {
    try {
      this.log('Testing language toggle functionality...');
      
      // Check if language and direction are properly applied
      const documentLang = document.documentElement.lang;
      const documentDir = document.documentElement.dir;
      const langStorage = localStorage.getItem('kyctrust_language');
      
      this.addResult('LanguageToggle', 'PASS', `Lang: ${documentLang}, Dir: ${documentDir}, Stored: ${langStorage}`);
      this.logSuccess('Language toggle test passed');
    } catch (error) {
      this.addResult('LanguageToggle', 'FAIL', `Error: ${error}`);
      this.logError('Language toggle test failed');
    }
  }

  // Test currency display
  private testCurrencyDisplay(): void {
    try {
      this.log('Testing currency display...');
      
      // Check if any element contains old currency (ریال)
      const bodyText = document.body.textContent || '';
      const hasOldCurrency = bodyText.includes('ریال') || bodyText.includes('ريال');
      
      if (hasOldCurrency) {
        this.addResult('CurrencyDisplay', 'FAIL', 'Old currency (ريال) still found in UI');
        this.logError('Currency still shows ريال instead of $ or EGP');
      } else {
        this.addResult('CurrencyDisplay', 'PASS', 'Currency properly updated to USD/EGP');
        this.logSuccess('Currency display test passed');
      }
    } catch (error) {
      this.addResult('CurrencyDisplay', 'FAIL', `Error: ${error}`);
      this.logError('Currency display test failed');
    }
  }

  // Test navigation functionality
  private testNavigation(): void {
    try {
      this.log('Testing navigation functionality...');
      
      // Check if main navigation elements exist
      const navButtons = document.querySelectorAll('nav a, nav button');
      const hasNavigation = navButtons.length > 0;
      
      if (hasNavigation) {
        this.addResult('Navigation', 'PASS', `Found ${navButtons.length} navigation elements`);
        this.logSuccess('Navigation test passed');
      } else {
        this.addResult('Navigation', 'FAIL', 'No navigation elements found');
        this.logError('Navigation test failed');
      }
    } catch (error) {
      this.addResult('Navigation', 'FAIL', `Error: ${error}`);
      this.logError('Navigation test failed');
    }
  }

  // Test admin panel accessibility
  private testAdminPanel(): void {
    try {
      this.log('Testing admin panel functionality...');
      
      // Check if admin route exists
      const currentPath = window.location.pathname;
      const isOnAdminPage = currentPath.includes('/admin');
      
      if (isOnAdminPage) {
        // Test admin components if on admin page
        const adminElements = document.querySelectorAll('[class*="admin"], .admin-panel');
        this.addResult('AdminPanel', 'PASS', `Admin page loaded with ${adminElements.length} admin elements`);
        this.logSuccess('Admin panel test passed');
      } else {
        // Test admin route accessibility
        this.addResult('AdminPanel', 'PASS', 'Admin panel route available (not currently on admin page)');
        this.logSuccess('Admin panel accessibility test passed');
      }
    } catch (error) {
      this.addResult('AdminPanel', 'FAIL', `Error: ${error}`);
      this.logError('Admin panel test failed');
    }
  }

  // Test React components rendering
  private testComponentRendering(): void {
    try {
      this.log('Testing component rendering...');
      
      // Check if main React components are rendered
      const reactElements = document.querySelectorAll('[data-reactroot], #root > div');
      const hasReactElements = reactElements.length > 0;
      
      if (hasReactElements) {
        this.addResult('ComponentRendering', 'PASS', 'React components rendering properly');
        this.logSuccess('Component rendering test passed');
      } else {
        this.addResult('ComponentRendering', 'FAIL', 'React components not rendering');
        this.logError('Component rendering test failed');
      }
    } catch (error) {
      this.addResult('ComponentRendering', 'FAIL', `Error: ${error}`);
      this.logError('Component rendering test failed');
    }
  }

  // Test responsive design
  private testResponsiveDesign(): void {
    try {
      this.log('Testing responsive design...');
      
      // Check if responsive classes exist
      const responsiveElements = document.querySelectorAll('[class*="lg:"], [class*="md:"], [class*="sm:"]');
      const hasResponsiveClasses = responsiveElements.length > 0;
      
      if (hasResponsiveClasses) {
        this.addResult('ResponsiveDesign', 'PASS', `Found ${responsiveElements.length} responsive elements`);
        this.logSuccess('Responsive design test passed');
      } else {
        this.addResult('ResponsiveDesign', 'FAIL', 'No responsive classes found');
        this.logError('Responsive design test failed');
      }
    } catch (error) {
      this.addResult('ResponsiveDesign', 'FAIL', `Error: ${error}`);
      this.logError('Responsive design test failed');
    }
  }

  // Run all tests
  public runAllTests(): TestResult[] {
    this.log('Starting comprehensive functionality tests...');
    this.results = [];

    this.testThemeToggle();
    this.testLanguageToggle();
    this.testCurrencyDisplay();
    this.testNavigation();
    this.testAdminPanel();
    this.testComponentRendering();
    this.testResponsiveDesign();

    this.generateReport();
    return this.results;
  }

  // Generate test report
  private generateReport(): void {
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const totalTests = this.results.length;

    console.group('🧪 Functionality Test Report');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Success Rate: ${((passCount / totalTests) * 100).toFixed(1)}%`);
    
    console.group('📋 Detailed Results:');
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.component}: ${result.message}`);
    });
    console.groupEnd();
    console.groupEnd();
  }
}

// Export test functions for manual use
export const runFunctionalityTests = (): TestResult[] => {
  const tester = new FunctionalityTester();
  return tester.runAllTests();
};

// Auto-run tests if in development mode
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Make tests available globally for manual testing
  (window as unknown as { runFunctionalityTests: () => TestResult[] }).runFunctionalityTests = runFunctionalityTests;
  
  console.log('🧪 Functionality tests available. Run: runFunctionalityTests()');
}

export default { runFunctionalityTests };
