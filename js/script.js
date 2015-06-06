(function(window, document, undefined) {

  /* Sets a random integer quantity in range [1, 20] for each flavor. */
  function setQuantities() {
	  var metaDiv = document.getElementsByClassName('meta');
	  for (var i = 0; i < metaDiv.length; i++) {
	  	var child = metaDiv[i].querySelector('span');
		var span = document.createElement('span');
		span.innerHTML = Math.floor(Math.random()*20) + 1;
		span.setAttribute('class','quantity');
		metaDiv[i].insertBefore(span,child);
		}
  }

  /* Extracts and returns an array of flavor objects based on data in the DOM. Each
   * flavor object should contain five properties:
   *
   * element: the HTMLElement that corresponds to the .flavor div in the DOM
   * name: the name of the flavor
   * description: the description of the flavor
   * price: how much the flavor costs
   * quantity: how many cups of the flavor are available
   */
  function extractFlavors() {
	  var flavor = [];
	  var loadFlavor = {};
	  var element = document.getElementsByClassName("flavor");
	  for (var i = 0; i < element.length; i++) {
		  loadFlavor.element = element[i];
		  loadFlavor.name = element[i].querySelector("h2").innerHTML;
		  loadFlavor.description = element[i].querySelector("p").innerHTML;
		  loadFlavor.price = parseFloat(element[i].getElementsByClassName("price")[0].innerHTML.substr(1));
		  loadFlavor.quantity = parseFloat(element[i].getElementsByClassName("quantity")[0].innerHTML);
		  flavor.push(loadFlavor);
		  loadFlavor = {};
	  }
	  return flavor;
  }

  /* Calculates and returns the average price of the given set of flavors. The
   * average should be rounded to two decimal places. */
  function calculateAveragePrice(flavors) {
	  var totalPrice = 0;
	  flavors.forEach(function(flavor) {
		  totalPrice+= flavor.price;
	  });
	  avgPrice = totalPrice / flavors.length
	  return avgPrice.toFixed(2);
  }

  /* Finds flavors that have prices below the given threshold. Returns an array
   * of strings, each of the form "[flavor] costs $[price]". There should be
   * one string for each cheap flavor. */
  function findCheapFlavors(flavors, threshold) {
    var cheapFlavors = flavors.filter(function(flavor) {
		if (flavor.price < threshold) {
			return flavor;
		}
		
    });
	
	var flavorStatus = cheapFlavors.map(function(flavor) {
		return flavor.name + ' costs $' + flavor.price; 
	});
	return flavorStatus;
	
  }

  /* Populates the select dropdown with options. There should be one option tag
   * for each of the given flavors. */
  function populateOptions(flavors) {
	  var optionMenu = document.querySelector('select[name="flavor"]');
	  var flavorOptions = document.createElement("option");
	  var child = optionMenu.querySelector("option");
	  for (var i = 0; i < flavors.length; i++) {
		  flavorOptions.innerHTML = flavors[i].name;
		  flavorOptions.setAttribute("value",flavors[i].name);
		  optionMenu.insertBefore(flavorOptions,child);
		  flavorOptions = document.createElement("option");
	  }
  }

  /* Processes orders for the given set of flavors. When a valid order is made,
   * decrements the quantity of the associated flavor. */
  function processOrders(flavors) {

	window.addEventListener('submit',function(event) {
		event.preventDefault();	
		var amount = document.querySelector('input[name="amount"]').value;
		var flavorSelected = document.querySelector('select[name="flavor"]').value;
		var flavorFiltered = flavors.filter(function(flavor) {
			return flavor.name === flavorSelected;
		});		
		if (flavorFiltered.length === 0) {
			return;
		}
		var flavorQuantity = flavorFiltered[0].quantity;
		if (amount > 0 && flavorQuantity >= amount) {
			var newFlavorQuantity = flavorQuantity - amount;
			document.querySelector('input[name="amount"]').value='';
			document.querySelector('select[name="flavor"]').value='Example flavor';
			flavorFiltered[0].element.getElementsByClassName('quantity')[0].innerHTML = newFlavorQuantity;
			flavorFiltered[0].quantity = newFlavorQuantity;
		}
    });
  }



  /* Highlights flavors when clicked to make a simple favoriting system. */
  function highlightFlavors(flavors) {
	  flavors.forEach(function(flavor) {
	  	flavor.element.addEventListener('click',function(event) {
	  		flavor.element.classList.toggle('highlighted');
	  	})
	  });
  }


  /***************************************************************************/
  /*                                                                         */
  /* Please do not modify code below this line, but feel free to examine it. */
  /*                                                                         */
  /***************************************************************************/


  var CHEAP_PRICE_THRESHOLD = 1.50;

  // setting quantities can modify the size of flavor divs, so apply the grid
  // layout *after* quantities have been set.
  setQuantities();
  var container = document.getElementById('container');
  new Masonry(container, { itemSelector: '.flavor' });

  // calculate statistics about flavors
  var flavors = extractFlavors();
  var averagePrice = calculateAveragePrice(flavors);
  console.log('Average price:', averagePrice);

  var cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD);
  console.log('Cheap flavors:', cheapFlavors);

  // handle flavor orders and highlighting
  populateOptions(flavors);
  processOrders(flavors);
  highlightFlavors(flavors);

})(window, document);
