# Async Event Pipeline

A lightweight, zero-dependency package that lets you define and execute a series of asynchronous tasks sequentially, passing data between them. It's perfect for **processing requests**, building data transformation **pipelines**, or **managing job queues** where order and async operations are critical.

Inspired by middleware frameworks like **Express.js**, **Async Event Pipeline** brings a similar, powerful pattern to **any JavaScript/Node.js** application.

## Key Features

*   **Sequential Execution**: Tasks run one after another, ensuring a predictable order of operations.
    
*   **Asynchronous Support**: Built for `async/await`, allowing tasks to perform I/O operations (e.g., database queries, API calls) without blocking.
    
*   **Data Propagation**: Data is passed through the pipeline, allowing each task to inspect or modify it.
    
*   **Error Handling**: A robust `next(err)` pattern allows any task to halt the pipeline and propagate an error.
    
*   **Zero Dependencies**: Lightweight and easy to integrate into any project.
    
*   **Modern Syntax**: Written in ES2015+ with a clean, chainable API.
    

## Use Cases

*   **API Middleware Chains**: Validate, authenticate, and process incoming HTTP requests before they hit your controller.
    
*   **Data Validation & Transformation**: Create multi-step pipelines to clean, validate, and reshape data from various sources.
    
*   **Job Queues**: Process background jobs in a specific sequence, such as sending emails, generating reports, or processing images.
    
*   **ETL Processes**: Build simple Extract, Transform, Load (ETL) workflows in a structured manner.
    

## Installation

```bash
npm install async-event-pipeline
```

## How It Works

The pipeline manages a queue of "tasks." When you call `.execute(initialData)`, it passes the data to the first task.

Each task is an `async` function that receives two arguments:

1.  `data`: The data payload from the previous task.
    
2.  `next`: A callback function to pass control to the next task.
    

*   To continue to the next task, call `next(null, modifiedData)`.
    
*   To stop the pipeline and report an error, call `next(new Error('...'))`.
    

## API Reference

### `new AsyncEventPipeline()`

Creates a new pipeline instance.

### `.add(task)`

Adds a task to the pipeline.

*   `task(data, next)`: The function to be executed.
    
    *   `data`: The data passed from the previous task.
        
    *   `next(error, newData)`: The callback to continue or stop the pipeline.
        
        *   `error` (optional): An `Error` object to stop the pipeline.
            
        *   `newData` (optional): The data to pass to the next task. If omitted, the original `data` is passed through.
            

Returns the `AsyncEventPipeline` instance for easy chaining.

### `.execute(initialData)`

Starts the execution of the pipeline.

*   `initialData`: The initial data to be passed to the first task.
    

Returns a `Promise` which:

*   **Resolves** with the final data after the last task completes.
    
*   **Rejects** if any task calls `next(error)` or throws an exception.
    
### `.exec(initialData)`

    Alias of `execute(initialData)`

### `.use(task)`

    Alias of `add(task)`


## Example: API Request Pipeline

Here's how you can simulate an API middleware chain.

```js
// nodejs
const AsyncEventPipeline = require('async-event-pipeline');

// OR

// for browser (UMD) - add in meta
// <script src="https://cdn.jsdelivr.net/npm/async-event-pipeline/dist/async-event-pipeline.umd.js"></script>


const pipeline = new AsyncEventPipeline();

const request = {
    headers: { 'authorization': 'Bearer valid-token' },
    body: { userId: 123, content: 'Hello World' }
};

// 1. Validation Middleware
pipeline.add(async (req, next) => {
    console.log('Step 1: Validating...');
    if (!req.body || !req.body.userId) {
        return next(new Error('Validation Error: userId is missing.'));
    }
    console.log('Validation successful.');
    next(null, req); // Pass data to the next task
});

// 2. Authentication Middleware
pipeline.add(async (req, next) => {
    console.log('Step 2: Authenticating...');
    if (req.headers['authorization'] !== 'Bearer valid-token') {
        return next(new Error('Authentication Error: Invalid token.'));
    }
    req.user = { id: 123, name: 'John Doe' };
    console.log('Authentication successful.');
    next(null, req);
});

// 3. Final Processing
pipeline.add(async (req, next) => {
    console.log('Step 3: Processing...');
    req.processedData = `Content "${req.body.content}" was posted by ${req.user.name}.`;
    next(null, req);
});

// Execute the pipeline
pipeline.execute(request)
    .then(finalResult => {
        console.log('\n✅ Pipeline executed successfully!');
        console.log('Final Result:', JSON.stringify(finalResult, null, 2));
    })
    .catch(error => {
        console.error('\n❌ Pipeline execution failed:', error.message);
    });
```

## Contributing

This is an open-source project. Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md "null") file for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE "null") file for details.

## Changelog

Please see the [CONTRIBUTING.md](CHANGELOG.md "null") file.

## Author

This packages codes was created by [**Mamedul Islam**](https://mamedul.github.io/ "null") and open for contribute.

_As a passionate **web developer** with experience in creating interactive and user-friendly web components. Currently *available for freelance projects* or full-time opportunities._

_Helping businesses grow their online presence with custom web solutions. Specializing in **WordPress**, **WooCommerce**, and **Shopify**. Building modern, responsive, and high-performance scalable websites with custom made plugins, codes, customizations._


## Keywords

_async_, _await_, _promise_, _pipeline_, _middleware_, _chain_, _queue_, _task_, _job_, _filter_, _sequential_, _flow_, _control_, _validation_, _transformation_