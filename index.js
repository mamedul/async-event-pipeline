/**
 * @license MIT
 * @author Mamedul Islam <https://mamedul.github.io>
 * @version 2025.9.80
 */

/**
 * Represents a pipeline that processes data through a series of asynchronous tasks.
 * Each task can modify the data and pass it to the next one.
 */
class AsyncEventPipeline {
    /**
     * @private
     * @type {Array<Function|Class|Object>}
     */
    #tasks = [];

    /**
     * Adds a task to the pipeline.
     * A task is an async function that receives the current data and a `next` callback.
     * It should call `next()` to pass control to the next task or `next(error)` to stop execution.
     *
     * @param {Function} task - The asynchronous task function to add.
     * @returns {AsyncEventPipeline} The pipeline instance for chaining.
     * @throws {TypeError} If the provided task is not a function.
     */
    add(task) {
		if (!(typeof task === 'function' || (typeof task === 'object' && task !== null))) {
			throw new TypeError('Task must be a function or class or object.');
		}
        this.#tasks.push(task);
        return this;
    }

    /**
     * Adds a task to the pipeline.
     * A task is an async function that receives the current data and a `next` callback.
     * It should call `next()` to pass control to the next task or `next(error)` to stop execution.
     *
     * @param {Function} task - The asynchronous task function to add.
     * @returns {AsyncEventPipeline} The pipeline instance for chaining.
     * @throws {TypeError} If the provided task is not a function.
     */
	use(task) {
        return this.add(task);
    }

    /**
     * Executes the pipeline with an initial data payload.
     *
     * @param {*} initialData - The initial data to be processed by the pipeline.
     * @returns {Promise<*>} A promise that resolves with the final data after all tasks have completed,
     * or rejects if any task passes an error to `next` or throws an exception.
     */
    async execute(initialData) {
        let currentIndex = -1;

        const runner = async (index, data) => {
            if (index === currentIndex) {
                throw new Error('next() called multiple times in the same task.');
            }
            currentIndex = index;

            // If we've run out of tasks, resolve with the final data
            if (index >= this.#tasks.length) {
                return data;
            }

            const task = this.#tasks[index];

            // Wrap the task execution in a Promise to handle both sync and async errors
            return new Promise((resolve, reject) => {
                const next = (err, nextData) => {
                    if (err) {
                        return reject(err);
                    }
                    // If nextData is provided, it replaces the current data payload.
                    // Otherwise, the original data is passed through.
                    const dataForNextTask = nextData !== undefined ? nextData : data;
                    resolve(runner(index + 1, dataForNextTask));
                };

                try {
                    if (typeof task === 'function') {
                        // Distinguish class vs function (safe detection)
                        if (/^class\s/.test(Function.prototype.toString.call(task))) {
                            new task(data, next);
                        } else {
                            task(data, next);
                        }
                    } else if (typeof task === 'object') {
                        // Look for a handler method (contract)
                        if (typeof task.handle === 'function') {
                            task.handle(data, next);
                        } else {
                            throw new TypeError('Object tasks must implement a handle(data, next) method.');
                        }
                    }
                } catch (err) {
                    reject(err);
                }
            });
        };

        return runner(0, initialData);
    }

    /**
     * Executes the pipeline with an initial data payload.
     *
     * @param {*} initialData - The initial data to be processed by the pipeline.
     * @returns {Promise<*>} A promise that resolves with the final data after all tasks have completed,
     * or rejects if any task passes an error to `next` or throws an exception.
     */
	exec(initialData) {
        return this.execute(initialData);
    }

}

module.exports = AsyncEventPipeline;
