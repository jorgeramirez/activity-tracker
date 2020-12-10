# tracker

A tiny library to track browser events. The code is primarily from [turkey](https://github.com/CuriousG102/turkey), with just minor adaptations to make it work outside Amazon Mechanical Turk.

# Build & Usage

You can build the library by running `build.sh`, and you are ready to import `builds/tracker.js` and use the registered auditors in your frontend code. 

Add the following line to setup the library (once imported)

```javascript
requestAnimationFrame(setupTracker);
```

once set, the library automatically starts listening for events, you can obtain a snapshot by

```javascript
window.auditor.dump()
```