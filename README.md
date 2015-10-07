When used with the webkit heap profiler and timeline, this tool is useful for confirming action cleanliness and detecting memory leaks in your web application.

1. Use bookmarklet (see looper.js source) to load the script onto the target page.
2. Create a heap profile under webkit tools 'Profile'.
3. Using the browser's console, create a loop function, providing an array of functions to `looper`: `var loop = looper([setup, teardown])`
4. `Record` activity in the webkit timeline.
5. Calling this function returns a Promise of the completion, which defaults to 27 runs. Run the function: `loop()`.
6. Let Looper finish.
7. Stop recording in the webkit timeline.
8. Create a second heap profile.
9. Compare the two heaps and evaluate memory growth in the timeline.
