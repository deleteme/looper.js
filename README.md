When used with the webkit heap profiler and timeline, this tool is useful for confirming action cleanliness and detecting memory leaks in your web application.

1. Use bookmarklet (see looper.js source) to load the script onto the target page.
2. Create a heap profile under webkit tools 'Profile'.
3. Create an instance of Looper `var looper = new Looper()` in the console.
4. Register callbacks with the `add()` method.
5. `Record` activity in the webkit timeline.
6. `looper.start()`.
7. Let Looper finish. A `done` callback is called.
8. Stop recording in the webkit timeline.
9. Create a second heap profile.
10. Compare the two heaps and evaluate memory growth in the timeline.