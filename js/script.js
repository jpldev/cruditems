var Crud = (function () {

	//Load items from local storage
	var loadItems = function () {

		var data = localStorage.getItem("items");
		var object = JSON.parse(data);

		if (object != null) {
			items = object;
		} else {
			var items = [];
		}

		return items;
	}

	var items = loadItems();

	var saveItems = function () {

		var data = JSON.stringify(items);
		localStorage.setItem("items", data);
	}

	var renderCounter = function () {
		$("#count").html(items.length);
	}

	//Add new Item to list
	var addItem = function (item) {
		items.push(item);
		saveItems();
		renderCounter();
	}

	var editItem = function (itemId, itemNuevo) {

		for (var i = 0; i < items.length; i++) {

			if (items[i].id == itemId) {

				itemEdit = { id: itemNuevo.id, desc: itemNuevo.desc, image: itemNuevo.image };

				items.splice(i, 1, itemEdit);

				saveItems();
				break;
			}
		}
	}

	var readURL = function (input, idImage) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#' + idImage).attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}

	}

	var clearRender = function () {

		for (var i = 0; i < items.length; i++) {
			$('li:eq(0)').remove();
		}
	}

	var clearRenderItem = function (itemId) {

		$('#' + itemId).remove();

	}

	var deleteItem = function (itemId) {

		for (var i = 0; i < items.length; i++) {

			if (items[i].id == itemId) {

				items.splice(i, 1);
				saveItems();
				renderCounter();
				clearRenderItem(itemId);

				break;
			}
		}
	}

	var renderItem = function (item) {
		li = $("<li/>");
		li.addClass("list-group-item");
		li.addClass("clearfix");
		li.attr("id", item.id);
		//BUTTONS
		span = $("<span/>");
		span.addClass("pull-right button-group")
		//EDIT
		buttonEdit = $("<button/>");
		buttonEdit.addClass("btn btn-primary");
		buttonEdit.attr("id", "edit");
		buttonEdit.html("Edit");
		spanButtonEdit = $("<span/>");
		spanButtonEdit.addClass("glyphicon glyphicon-edit");
		buttonEdit.append(spanButtonEdit)
		span.append(buttonEdit);
		//DELETE
		buttonDelete = $("<button/>");
		buttonDelete.addClass("btn btn-danger");
		buttonDelete.html("Delete");
		spanButtonDelete = $("<span/>");
		spanButtonDelete.addClass("glyphicon glyphicon-remove");
		buttonDelete.append(spanButtonDelete);
		span.append(buttonDelete);

		//SAVE
		buttonSave = $("<button/>");
		buttonSave.addClass("btn btn-warning");
		buttonSave.attr("id", "bs" + item.id);
		buttonSave.html("Save");
		spanButtonSave = $("<span/>");
		spanButtonSave.addClass("glyphicon glyphicon-edit");
		span.append(buttonSave);
		buttonSave.hide();

		//DESCRIPTION
		desc = $("<p/>");
		desc.attr("id", "p" + item.id);
		desc.html(item.desc);
		// desc.addClass("editable")

		//IMAGE

		ima = $("<img/>");
		ima.attr("id", "i" + item.id);
		ima.attr("src", item.image);

		inp = $("<input/>");
		inp.addClass("inputImg");
		inp.attr("id", "inp" + item.id);
		inp.attr("type", "file");
		inp.attr("name", "photo");
		inp.attr("accep", ".jpg,.gif,.png");


		li.append(desc);
		li.append(span);
		li.append(ima);
		li.append(inp);

		inp.hide();

		$("#listItems").append(li);

		//EVENTS
		buttonDelete.on("click", function () {
			deleteItem(item.id);
			console.log(item.id)
		});

		buttonEdit.on("click", function () {

			//Load last Image
			imageEdit = item.image;

			$("#inp" + item.id).show();

			$("#inp" + item.id).change(function () {
				readURL(this, "i" + item.id);
			});

			//If Load new image, ovewrite imageEdit
			$("#i" + item.id).on("load", function () {
				imageEdit = $("#i" + item.id).attr("src");
			})

			buttonSaveItem = $("#bs" + item.id);

			$("#bs" + item.id).show();

			description = $("#p" + item.id);

			isEditable = description.is('.editable');

			description.attr('contentEditable', !isEditable);
			description.toggleClass('editable');

			setTimeout(function () {
				description.focus();
			}, 0);

			buttonSaveItem.on("click", function () {

				description = $("#p" + item.id);
				descText = description.text();
				newItem = { id: item.id, desc: descText, image: imageEdit }

				editItem(item.id, newItem);

				buttonSaveItem.hide();
				$("#inp" + item.id).hide();

			});

		});
	}

	var renderItems = function () {

		for (var i = 0; i < items.length; i++) {
			renderItem(items[i]);
		}
	}

	var saveNewOrder = function (newOrder) {

		itemsReordered = [];

		for (var i = 0; i < newOrder.length; i++) {

			for (var j = 0; j < items.length; j++) {

				if (items[j].id == newOrder[i]) {
					itemsReordered.push(items[j]);
				}
			}
		}

		items = itemsReordered;
		saveItems();
	}

	var loadEvents = function () {
		//Get uploaded image
		$("#uploadImage").change(function () {
			readURL(this, "preview");
		});

		//If Load new image, ovewrite imageEdit
		$("#preview").on("load", function () {
			inputImage = $("#preview").attr("src");
		})

		//Add new Item
		$("#addItem").on("click", function () {
			inputImage = $("#preview").attr("src")
			inputDesc = $("#description").val();
			itemsLen = items.length;

			var img = document.getElementById('preview');
			var width = img.clientWidth;
			var height = img.clientHeight;

			item = { "id": itemsLen, "desc": inputDesc, "image": inputImage };

			//Check description and image
			if (inputDesc.length > 300) {

				alert("Description: max 300 chars");

			} else if (width !== 320 && height !== 320) {

				console.log(width);
				console.log(height);
				alert("Size of image must be 320px x 320px")

			} else {
				addItem(item);
				// Clear input for new item
				$("#description").val("");
				$("#imageData").attr("href", "#");
				$("#preview").attr("src", "images/thumbb.png");
				//Quit filename

				clearRender();
				renderItems();
			}

		});

		//Update Counter
		$("#count").ready(function () {

			$("#count").html(items.length);

		});

		$('#listItems').sortable({
			connectWith: '#listItems',
			update: function () {
				var order = $(this).sortable('toArray');
				saveNewOrder(order);
			}
		});

	}

	var start = function () {
		loadEvents();
		renderItems();
	}

	return {
		start: start
	}
})();

$(document).ready(Crud.start);