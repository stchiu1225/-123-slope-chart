# Slope chart

https://observablehq.com/d/1cd9dff9acadccad@243

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@5
npm install https://api.observablehq.com/d/1cd9dff9acadccad@243.tgz?v=3
~~~

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow that publishes the static
files in this folder to GitHub Pages whenever the `work` or `main` branch is
updated. To enable the deployment:

1. In your repository settings, enable GitHub Pages with **Deploy from a
   branch** and select **GitHub Actions** as the source.
2. Push the branch you want to publish (for example, `work` or `main`) to
   GitHub. The workflow at `.github/workflows/deploy.yml` will build and deploy
   the site.
3. After the workflow finishes, the published site URL will appear in the
   workflow summary under the **github-pages** environment.

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "1cd9dff9acadccad";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
