define.class("$server/composition",
	function ($ui$, screen, view) {

		define.class(this, "myview", "$ui/view", function() {
			this.attributes = {
					aBool: false,
				bBool: Config({value: false, type: Boolean}),
				numClicks: 0,
				userid: Config({value: -1, type: Number}),
				someText: "Just a string",
				moreText: Config({type:string, value:"Another string"}),
				colors: [],
				moreColor: Config({type: Array}),
			  marker: {},
			  candidate: Config({type: Object, value: {}, persist:true}),
		};
			this.init = function() {
				console.log(this.anArray);
				this.anArray = [1,2];
			}
		});

		this.render = function() {
			return[
				screen(
					{name:'default',clearcolor: 'green'},
					this.myview({})
				)
			];
		};

	}
);
