/**
 * Test for track_event error handling improvements
 * Tests the enhanced error serialization and handling
 */

import { serializeError } from './errorHandler';

export const testTrackEventErrorHandling = (): void => {
  console.log('🧪 Testing track_event error handling improvements...');

  // Test 1: Empty object error (the original issue)
  const emptyObjectError = {};
  const serialized1 = serializeError(emptyObjectError, {
    action: 'database_operation',
    metadata: { operation: 'track_event', table: 'analytics_events' }
  });
  console.log('📋 Empty object error serialization:', JSON.stringify(serialized1, null, 2));

  // Test 2: Supabase-like error object
  const supabaseError = {
    message: 'relation "analytics_events" does not exist',
    code: '42P01',
    details: null,
    hint: null,
    status: 400,
    statusText: 'Bad Request'
  };
  const serialized2 = serializeError(supabaseError, {
    action: 'database_operation',
    metadata: { operation: 'track_event', table: 'analytics_events' }
  });
  console.log('📋 Supabase error serialization:', JSON.stringify(serialized2, null, 2));

  // Test 3: Complex object with nested properties
  const complexError = {
    name: 'PostgrestError',
    message: 'Failed to insert row',
    code: 'PGRST301',
    details: 'Insert conflict',
    hint: 'Check table constraints',
    status: 409,
    body: { error: 'Duplicate key value' }
  };
  const serialized3 = serializeError(complexError, {
    action: 'database_operation',
    metadata: { operation: 'track_event', table: 'analytics_events' }
  });
  console.log('📋 Complex error serialization:', JSON.stringify(serialized3, null, 2));

  // Test 4: Object with no useful properties (should show improved fallback)
  const uselessError = { constructor: Object };
  const serialized4 = serializeError(uselessError, {
    action: 'database_operation',
    metadata: { operation: 'track_event', table: 'analytics_events' }
  });
  console.log('📋 Useless object error serialization:', JSON.stringify(serialized4, null, 2));

  console.log('✅ track_event error handling test completed');
};

// Test the error extraction specifically
export const testErrorExtraction = (): void => {
  console.log('🔍 Testing error message extraction...');
  
  const testCases = [
    {},
    { message: 'Test message' },
    { details: 'Test details' },
    { hint: 'Test hint' },
    { error: 'Test error property' },
    { toString: () => 'Custom toString' },
    'String error',
    null,
    undefined,
    123
  ];

  testCases.forEach((testCase, index) => {
    const serialized = serializeError(testCase);
    console.log(`Test case ${index + 1}:`, {
      input: testCase,
      extractedMessage: serialized.message,
      errorType: serialized.context?.errorType
    });
  });

  console.log('✅ Error extraction test completed');
};

// Auto-run tests in development
if (import.meta.env.DEV) {
  console.log('🚀 Auto-running track_event error handling tests...');
  testTrackEventErrorHandling();
  testErrorExtraction();
}
