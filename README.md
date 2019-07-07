# Including in a script tag

If you want to include the library in a script tag of your html page,
then you will need to build the minified version of the library. Make
sure you have `yarn` installed and then execute the following commands
in the root directory of the project:

    yarn install
	yarn build
	
The minified javascript file will be written to
`dist/identishapes.min.js`. Link to that file using a script tag. The
module will be available under the global variable `identishapes`.

# Including as a JS module

If you can use ES2015 modules directly then you may skip the build
step above and just include `src/index.js` in your project (possibly
renaming it).

Then in your javascript files import it like this:

    import identishapes from 'path/to/the/library'

# Usage

    // Obtaining an object
    let identicon = new identishapes.Arcs("#svg-element")
	
	// Or using an element directly
	let element = document.getElementById("svg-element")
	let identicon = new identishapes.Arcs(element)
	
	// Or you can let the class create it's root element automatically
	let identicon = new identishapes.Arcs()
	do_something_with_root(identicon.root)
	
	// Using the object
	identicon.render("some string")
	setTimeout(() => identicon.render("other string"), 5000)
	
Also see `example/index.html`.
	
# Full description

    class Arcs(root, flags)

	root : string | XMLElement | undefined
	flags : object | undefined
	flags.fill: boolean | undefined
	
	  async method render(seed)
	  
	  seed: string

Arcs may optionally accept a boolean `flags.fill` parameter. If it's
set to true the generated arcs will be filled with color from the
center of icon.
