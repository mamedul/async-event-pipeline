/**
 * @fileoverview Preview and example usage for the AsyncEventPipeline package.
 * To run: `node preview.js`
 */
const AsyncEventPipeline = require('./index');

console.log('🚀 Starting AsyncEventPipeline Preview...\n');

/**
 * Delays execution for a specified amount of time.
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @example: API Middleware Chain
 * Simulates processing an API request through validation, authentication, and data fetching.
 */
async function testApiMiddleware() {
    console.log('--- Example 1: API Middleware Chain ---');
    const pipeline = new AsyncEventPipeline();

    const request = {
        headers: { 'authorization': 'Bearer valid-token' },
        body: { userId: 123, content: 'Hello World' }
    };

    // 1. Validation Middleware
    pipeline.add(async (req, next) => {
        console.log('Step 1: Validating request body...');
        await delay(100);
        if (!req.body || !req.body.userId) {
            return next(new Error('Validation Error: userId is missing.'));
        }
        console.log('✅ Validation successful.');
        // Pass control to the next middleware
        next(null, req);
    });

    // 2. Authentication Middleware
    pipeline.add(async (req, next) => {
        console.log('Step 2: Authenticating user...');
        await delay(150);
        if (req.headers['authorization'] !== 'Bearer valid-token') {
            return next(new Error('Authentication Error: Invalid token.'));
        }
        req.user = { id: 123, name: 'John Doe' };
        console.log('✅ Authentication successful.');
        next(null, req);
    });

    // 3. Data Processing/Fetching
    pipeline.add(async (req, next) => {
        console.log('Step 3: Processing data...');
        await delay(200);
        req.processedData = `Content "${req.body.content}" by ${req.user.name}.`;
        console.log('✅ Data processing complete.');
        next(null, req);
    });

    try {
        const finalResult = await pipeline.execute(request);
        console.log('\n✅ Pipeline executed successfully!');
        console.log('Final Result:', JSON.stringify(finalResult, null, 2));
    } catch (error) {
        console.error('\n❌ Pipeline execution failed:', error.message);
    }
    console.log('-------------------------------------\n');
}

/**
 * @example: Data Transformation Pipeline
 * Transforms a raw data object into a formatted one.
 */
async function testDataTransformation() {
    console.log('--- Example 2: Data Transformation ---');
    const pipeline = new AsyncEventPipeline();
    const rawData = { firstName: 'jane', lastName: 'doe', 'dob': '1995-08-15' };

    // Task to capitalize names
    pipeline.add((data, next) => {
        console.log('Step 1: Capitalizing names...');
        data.firstName = data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
        data.lastName = data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1);
        console.log(` > Result: ${data.firstName} ${data.lastName}`);
        next(null, data);
    });

    // Task to calculate age
    pipeline.add((data, next) => {
        console.log('Step 2: Calculating age...');
        const birthDate = new Date(data.dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        data.age = Math.abs(ageDate.getUTCFullYear() - 1970);
        console.log(` > Result: Age is ${data.age}`);
        next(null, data);
    });

    // Task to format the final object
    pipeline.add((data, next) => {
        console.log('Step 3: Formatting output...');
        const formatted = {
            fullName: `${data.firstName} ${data.lastName}`,
            age: data.age
        };
        console.log(' > Final format created.');
        next(null, formatted);
    });


    try {
        const result = await pipeline.execute(rawData);
        console.log('\n✅ Transformation complete!');
        console.log('Final Object:', result);
    } catch (error) {
        console.error('\n❌ Transformation failed:', error.message);
    }
    console.log('-------------------------------------\n');
}


// Run all tests
(async () => {
    await testApiMiddleware();
    await testDataTransformation();
    console.log('✅ All previews finished.');
})();
