/*************************************************************
	~ jQuery Dynamic Dialog ~
		(Bootstrap Modal's Younger Brother - lol)
--------------------------------------------------------------
	Author:     Kevin Chiu (Mocha Development)
	Version:    1.0.0 (December 15, 2012)

	Options:    $().dynamicDialog({
					header: "",
					body: "",

					// Buttons
					save: "",
					saveText: "Save Changes",
					saveClass: "primary",   // info|cancel|info|inverse|danger

					close: function() { },
					closeText: "Close",
					closeClass: "",         // info|cancel|info|inverse|danger

					width: "50%",
					height: "80%",
					trigger: "click",
					ajaxCallback: "",
					ajaxURL: ""
				})
*************************************************************/
(function($) {
	var isQuirksMode = !(document.compatMode == 'CSS1Compat');

	$.widget("B3T4.dynamicDialog", {
		/**********************************/
		/* DynamiC Dialog Default Options */
		/**********************************/
		options: {
			header: "Hi, I am a Sexy Dialog!",
			body: "Sorry, I have nothing to tell you =( ",

			// Buttons
			save: "",
			saveText: "Save Changes",
			// info|cancel|info|inverse|danger
			saveClass: "primary",

			close: '',
			closeText: "Close",
			// info|cancel|info|inverse|danger
			closeClass: "",

			// Dialog Attributes
			width: "50%",
			height: "80%",
			// click|hover|onchange|mouseover|mouseout
			trigger: "click",
			ajaxCallback: function(data) { },
			ajaxURL: "",

			// Miscellaneous/Private
			classPrefix: "btn-",

			modal: "#usmc-modal",
			backdrop: "#modal-backdrop"
		},

		/***************************/
		/* Setup Dialog Settings ***/
		/***************************/
		_create: function() {
			// The _create method is where you set up the widget
			var self = this,
				element = $(self.element),
				options = self.options,
				modal = $("#usmc-modal"),
				hasHREF = element.attr("href") !== undefined && element.attr("href").length != "" && 
						  element.attr("href").search(/(javascript:?)|(\#)/) == -1,
				customNameSpace = "";

			if(hasHREF) {
				this.options.ajaxURL = element.attr("href");
			}

			// If trigger is click, unbind all clicks if object is an <a> tag to prevent page requests.
			if(options.trigger == "click" && element.prop("tagName") == "A") {
				element.off(options.trigger)
			}

			options.trigger = options.trigger.toLowerCase();
			customNamespace = options.trigger + ".dynamicDialog";


			// Apply Trigger Event to Custom Namespace
			element.on(customNamespace, function() {
				$(options.backdrop)
					// Throw Loading Modal to Signal Loading Process
					.show()
					// Trigger Focus event on Loading Modal to Re-Delegate any Tooltip onMouseOver Events
					.hover();
					
				// Apply Event Triggers to Buttons
				self._applyButtons();
				self.show();
				return false;
			});
		},

		/*************************************************/
		/* Apply Dialog Event Triggers to Calling Object */
		/*************************************************/
		show: function() {
			var self = this,
				options = this.options,

				parent = $(window),
				outerWidth = parent.width(),
				outerHeight = parent.height(),

				modal = $(options.modal),
				header = modal.find(".modal-header h3"),
				body = modal.find(".modal-body div"),
				footer = modal.find(".modal-footer"),

				width = options.width,
				height = options.height;

				// Update & Show Modal Dialog
				if( options.ajaxURL.length > 0 ) {
					$.ajax({
						url: options.ajaxURL,
						type: "post",
						success: function(data) {
							var html = (data.search(/<body|\/body>/g) > -1) ?
											data.substring(data.search(/<body|\/body>/g), data.length) :
											data;
								html = html.replace(/<body.+>|<\/body>/g, "");

								header.html(options.header);
								body.html(html);


								if(width.match(/%/)) {
									width = parseInt(width.replace(/%/, "")) / 100;
									width = outerWidth * width;
								}

								if(height.match(/%/)) {
									height = parseInt(height.replace(/%/, "")) / 100;
									height = outerHeight * height;
								}

								// Resize Modal and Re-Position Based on Options
								modal
									.width(width)
									.height(height)
									.css({
										marginLeft: -width / 2,
										marginTop: -height / 2,
										top: "50%",
										left: "50%"
									})

								// Resize Modal Components
								var totalPadding = 18 + 30 + 29;
								var totalHeight = 30 + 30;

								bodyHeight = height - totalPadding - totalHeight;

								body.parent().height(bodyHeight);

								modal.modal();
						}
					}).complete(function() {
						$("body")
							// -----------------------------------
							// Event Re-Delegate Links to Dialog
							// -----------------------------------
							.on("click", ".modal-body a:not(.nav-tabs-tab)", function() {
								$.ajax({
									url: $(this).attr("href"),
									type: "post",
									success: function(data) {
										var html = (data.search(/<body|\/body>/g) > -1) ?
														data.substring(data.search(/<body|\/body>/g), data.length) :
														data;
											html = html.replace(/<body.+>|<\/body>/g, "");

											header.html(options.header);
											body.html(html);
											body.parent().scrollTop(0);
										}
								});

								return false;
							})
							// ------------------------------------------
							// Event Re-Delegate Form Submits to Dialog
							// ------------------------------------------
							.on("submit", ".modal-body form:not(.upload-form)", function() {
								var form = $(this),
									params = form.serialize(),
									action = form.attr("action");

									$.ajax({
										url: action + "?" + params,
										type: "post",
										success: function(data) {
											var html = (data.search(/<body|\/body>/g) > -1) ?
															data.substring(data.search(/<body|\/body>/g), data.length) :
															data;
												html = html.replace(/<body.+>|<\/body>/g, "");

												header.html(options.header);
												body.html(html);
												body.parent().scrollTop(0);
											}
									});

									return false;
							});
					});
				} else {
					header.html(options.header);
					body.html(options.body);
					$(options.backdrop).show();
					modal.modal();
				}
		},

		/****************************************/
		/* Apply Button Configurations & Events */
		/****************************************/
		_applyButtons: function() {
			var self = this,
				options = this.options,

				modal = $("#usmc-modal"),
				saveButton = modal.find("#save-button"),
				closeButton = modal.find("#close-button");

				fnClose = options.close & '$("#usmc-modal").modal("hide");';

				// Apply Button Configurations
				if($.isFunction(options.save)) {
					saveButton
						.html(options.saveText)
						.removeClass().addClass("btn")
						.addClass(options.classPrefix + options.saveClass);
				}

				closeButton
					.html(options.closeText)
					.removeClass().addClass("btn")
					.addClass(options.classPrefix + options.closeClass);

				// Apply Event to Close Button
				closeButton.off().on("click", function() {
					if($.isFunction(options.close)) {
						options.close();
					}

					$("#usmc-modal").modal("hide");
				});

				// Apply Event to Save Button
				if($.isFunction(options.save)) {
					saveButton.removeClass("hide");
					saveButton.off().on("click", options.save);
				} else {
					saveButton.addClass("hide");
				}
		},

		/********************************/
		/* jQuery Widget Options Setter */
		/********************************/
		_setOption: function(key, value) {
			// Use the _setOption method to respond to changes to options
			switch(key) {
				case "length":
					break;
			}

			$.Widget.prototype._setOption.apply(this,arguments)
		},

		/***************************************/
		/* Reset & Restore to Original Context */
		/***************************************/
		destroy: function() {
			// Use the destroy method to reverse everything your plugin has applied
			$.Widget.prototype.destroy.call(this);
		}
	});
})(jQuery);