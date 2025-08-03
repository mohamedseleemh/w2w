/**
 * Test error handling for landing page service
 */

import { landingPageService } from '../services/landingPageService';
import { extractErrorMessage } from './errorHandler';

export const testLandingPageErrorHandling = async (): Promise<void> => {
  console.group('🧪 Testing Landing Page Error Handling');
  
  try {
    // Test extractErrorMessage function
    console.log('✅ Testing extractErrorMessage function...');
    
    // Test with different error types
    const stringError = extractErrorMessage('Simple string error');
    console.log('String error:', stringError);
    
    const objectError = extractErrorMessage({ message: 'Object error message' });
    console.log('Object error:', objectError);
    
    const complexError = extractErrorMessage({ 
      code: 'PGRST301', 
      details: 'Database connection failed',
      hint: 'Check your connection'
    });
    console.log('Complex error:', complexError);
    
    // Test landing page service
    console.log('✅ Testing landing page service...');
    
    try {
      const sections = await landingPageService.getLandingPageSections();
      console.log('Landing sections loaded:', sections.length, 'sections');
    } catch (serviceError) {
      console.log('Service error handled:', extractErrorMessage(serviceError));
    }
    
    try {
      const templates = await landingPageService.getPageTemplates();
      console.log('Page templates loaded:', templates.length, 'templates');
    } catch (templateError) {
      console.log('Template error handled:', extractErrorMessage(templateError));
    }
    
    console.log('✅ All error handling tests completed successfully');
    
  } catch (error) {
    console.error('❌ Error handling test failed:', extractErrorMessage(error));
  }
  
  console.groupEnd();
};

// Make test available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as unknown as { testLandingPageErrorHandling: () => Promise<void> }).testLandingPageErrorHandling = testLandingPageErrorHandling;
  console.log('🧪 Landing page error handling test available: testLandingPageErrorHandling()');
}

export default { testLandingPageErrorHandling };
