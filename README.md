# HTL TodoMVC Example

This example shows how to build components in [AEM 6+](http://www.adobe.com/go/aem) with [HTL](https://github.com/Adobe-Marketing-Cloud/htl-spec). It's a feature-complete implementation of the famous [TodoMVC](http://todomvc.com) exercise, which is traditionally meant for client-side JavaScript frameworks. This implementation though shows how such an application can easily be built in AEM and it's status persisted on the server using the Apache Sling REST framework.

All in about 300 lines of server- and client-side JavaScript code, following the latest AEM best practice!

## Learning HTL

The [HTML Template Language](https://docs.adobe.com/docs/en/htl.html "Introduction to the HTML Template Language") (HTL), formerly known as Sightly, has been introduced with [Adobe Experience Manager](http://www.adobe.com/solutions/web-experience-management.html) 6.0 and takes the place of JSP (JavaServer Pages) as the preferred and recommended server-side template system for HTML.

The [HTML Template Language documentation on the AEM Site](https://docs.adobe.com/docs/en/htl.html) is a great resource for getting started.

You can also read following blog posts:

* [New HTL Features in AEM 6.1](http://blogs.adobe.com/experiencedelivers/experience-management/htl-features-aem61/)
* [Javascript Use-API With HTL](http://blogs.adobe.com/experiencedelivers/experience-management/htl-javascript-use-api/)
* [HTL intro part 1](http://blogs.adobe.com/experiencedelivers/experience-management/htl-intro-part-1/)
* [HTL intro part 2](http://blogs.adobe.com/experiencedelivers/experience-management/htl-intro-part-2/)
* [HTL intro part 3](http://blogs.adobe.com/experiencedelivers/experience-management/htl-intro-part-3/)
* [HTL intro part 4](http://blogs.adobe.com/experiencedelivers/experience-management/htl-intro-part-4/)
* [HTL intro part 5: FAQ](http://blogs.adobe.com/experiencedelivers/experience-management/htl-intro-part-5/)
* [HTL and Clientlibs](http://blogs.adobe.com/experiencedelivers/experience-management/htl-clientlibs/)
* [Date Formatting with HTL](http://blogs.adobe.com/experiencedelivers/experience-management/htl-date-formatting/)

Get help from other HTL users:

* [HTL](https://twitter.com/Adobe_HTL)
* [Gabriel](https://twitter.com/gabrielwalt)
* [Senol](https://twitter.com/thelabertasch)

If you are interested to learn how we came up with HTL, check out the [Behind the Scenes Youtube channel](https://www.youtube.com/playlist?list=PLkBe8kbE_7-xeo5uNJVE4uZXRpOpCA0J8).

## Implementation

The server sets a number of data attributes to the HTML elements that are interactive. These data attributes are instructing the app front-end about the asynchronous POST requests that are to be done when interacting with these elements, in order to persist the manipulations to the server. After each manipulation, the app content is reloaded through an asynchronous query to retreive the HTML fragment of the view that must be updated.

Beyond the classic MVC, this architecture also has following particularities:

* The [Sling Post Servlet](http://sling.apache.org/documentation/bundles/manipulating-content-the-slingpostservlet-servlets-post.html) makes it possible that no code has to be written to handle the POST requests.
* Through the data attributes set by the server, the client needs no knowledge of how to structure the data for the Sling Post Servlet.
* To retreive the HTML fragment of what must be updated on the page, a simple `todoapp` [selector](http://sling.apache.org/documentation/the-sling-engine/url-decomposition.html) allows to trigger the specific template that handles that part of the view.
* The filters (to show all, or only active or completed items) use an additional selector, which allows the server to know which items to render.

Note that [Java](https://docs.adobe.com/docs/en/htl/use-api/java.html) could also have been used instead of the server-side JavaScript files.

#### Content

The nodes located in the content repository at `/content/todo` are serialized in a [`.content.xml`](src/jcr_root/content/todo/.content.xml) file with following content:

* [`jcr:content`](src/jcr_root/content/todo/.content.xml#L4-L18) The content node for the todo page. It contains the title and various labels that are to be displayed on the page, but important is the `sling:resourceType` property, which makes this node rendered by the [`page`](src/jcr_root/apps/todo/components/page) component.
  * [The child nodes](src/jcr_root/content/todo/.content.xml#L19-L23) with their titles and completed status. As the `sling:resourceType` property defines it, they are rendered by the [`item`](src/jcr_root/apps/todo/components/item) component.

#### Server-side components

[AEM components](https://docs.adobe.com/docs/en/aem/6-2/develop/components.html) render individual content nodes based on their `sling:resourceType` properties.

* [`page`](src/jcr_root/apps/todo/components/page)
  Renders the page content node.
  * [`page.html`](src/jcr_root/apps/todo/components/page/page.html)
    **Entry point:** The outer page markup that doesn't change when actions are performed.
  * [`page.js`](src/jcr_root/apps/todo/components/page/page.js)
    Server-side script that prepares additional data model needed by `page.html`.
  * [`todoapp.html`](src/jcr_root/apps/todo/components/page/todoapp.html)
    Renders the list of todo items. **Called** directly when fetching what changed in the view.
  * [`todoapp.js`](src/jcr_root/apps/todo/components/page/todoapp.js)
    Server-side script that prepares additional data model needed by the template, which also defines the data attributes that instruct the front-end POST requests.
* [`item`](src/jcr_root/apps/todo/components/item)
  Renders the todo item content nodes.
  * [`item.html`](src/jcr_root/apps/todo/components/item/item.html)
    Renders the markup for the items.
  * [`item.js`](src/jcr_root/apps/todo/components/item/item.js)
    Server-side script that prepares additional data model needed by the template, which also defines the data attributes that instruct the front-end POST requests.
* [`utils`](src/jcr_root/apps/todo/components/utils)
  Collection of reusable scripts.
  * [`filters.js`](src/jcr_root/apps/todo/components/utils/filters.js)
    Defines what filters are set depending on the request selectors (i.e. to show all, or only active or completed items).

#### Client-side libraries

[Client libraries](https://docs.adobe.com/docs/en/aem/6-2/develop/the-basics/clientlibs.html) can conveniently combine and minimize multiple CSS and JS files:

* [`clientlib`](src/jcr_root/etc/designs/todo/clientlib)
  * [`css.txt`](src/jcr_root/etc/designs/todo/clientlib/css.txt)
    Lists the oder in which to load the CSS files.
  * [`js.txt`](src/jcr_root/etc/designs/todo/clientlib/js.txt)
    Lists the oder in which to load the JS files.
  * [`css`](src/jcr_root/etc/designs/todo/clientlib/css)
    * [`base.css`](src/jcr_root/etc/designs/todo/clientlib/css/base.css)
      The style base provided by the [TodoMVC template](https://github.com/tastejs/todomvc/tree/gh-pages/template).
  * [`js`](src/jcr_root/etc/designs/todo/clientlib/js)
    * [`jquery.js`](src/jcr_root/etc/designs/todo/clientlib/js/jquery.js)
      For convenience of writing concise JS...
    * [`app.js`](src/jcr_root/etc/designs/todo/clientlib/js/app.js)
      Implementation of all the **web app interactions**.

## Running it

* **Create package**
  * Get the code from this Git repository, for e.g. with following command line:  
      `git clone https://github.com/Adobe-Marketing-Cloud/aem-sample-sightly-todomvc.git`
  * Create a ZIP file from the `src` folder, for e.g. in a Unix shell you can do:  
      `cd aem-sample-sightly-todomvc/src`  
      `zip TodoMVC.zip -r jcr_root META-INF`
* **Start AEM**
  * Double-click on the AEM JAR to start an instance if you haven't done that already.
  * Once you're prompted with a login in your browser, enter `admin` as username and password.
* **Install package**
  * Goto the [AEM Package Manager](http://localhost:4502/crx/packmgr/index.jsp).
  * Click on `Upload package` and browse for your ZIP file, then hit `OK`.
  * Once `TodoMVC.zip` shows up at the top of the list, click on `Install` => `Install`.
* **Run the app**
  * Access the [Todo](http://localhost:4502/content/todo.html) page.
