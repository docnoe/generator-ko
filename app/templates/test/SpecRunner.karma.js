var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/test\/components\/.*\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    baseUrl: '/base/<%= sourceBase %>',
    deps: tests,
    callback: window.__karma__.start
});
