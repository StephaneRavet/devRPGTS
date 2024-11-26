export function LogMethod() {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = performance.now();
      console.group(`🎮 Method: ${propertyKey}`);
      console.log('⏰ Started at:', new Date().toISOString());
      console.log('📝 Arguments:', args);

      try {
        const result = await originalMethod.apply(this, args);
        const executionTime = performance.now() - startTime;
        console.log('✅ Result:', result);
        console.log(`⚡ Execution time: ${executionTime.toFixed(2)}ms`);
        return result;
      } catch (error) {
        console.error('❌ Error:', error);
        throw error;
      } finally {
        console.groupEnd();
      }
    };

    return descriptor;
  };
} 