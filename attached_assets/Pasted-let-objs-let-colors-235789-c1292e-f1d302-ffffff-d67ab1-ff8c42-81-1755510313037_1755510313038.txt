let objs = [];
let colors = ['#235789', '#c1292e', '#f1d302', '#ffffff', '#d67ab1', '#ff8c42', '#81c14b', '#2e933c', '#e4572e', '#17bebb'];

function setup() {
	createCanvas(900, 900);
	let c = 8;
	let w = width / c;
	for (let i = 0; i < c; i++) {
		for (let j = 0; j < c; j++) {
			let x = i * w + w / 2;
			let y = j * w + w / 2;
			objs.push(new OBJ(x, y, w));
		}
	}
}

function draw() {
	background(0);
	for (let i of objs) {
		i.run();
	}
}

function easeInOutExpo(x) {
	return x === 0
		? 0
		: x === 1
			? 1
			: x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
				: (2 - Math.pow(2, -20 * x + 10)) / 2;
}

class OBJ {
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.cx = x;
		this.cy = y;
		this.init();
		this.cols = [];
		shuffle(colors, true);
		for (let i = 0; i < 4; i++) {
			this.cols.push(colors[i]);
		}
		this.t1 = 50;
	}

	show() {
		noStroke();
		let xx = this.x - (this.w / 2);
		let yy = this.y - (this.w / 2);
		let ww = this.cx - xx;
		let hh = this.cy - yy;
		let off = this.w * 0.1;
		let crr = this.w * 0.5
		fill(this.cols[0]);
		rect(xx + (off / 2), yy + (off / 2), ww - off, hh - off, crr);
		fill(this.cols[1]);
		rect(xx + ww + (off / 2), yy + (off / 2), this.w - ww - off, hh - off, crr);
		fill(this.cols[2]);
		rect(this.cx + (off / 2), this.cy + (off / 2), this.w - ww - off, this.w - hh - off, crr);
		fill(this.cols[3]);
		rect(xx + (off / 2), yy + hh + (off / 2), ww - off, this.w - hh - off, crr);

	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1);
			this.cx = lerp(this.cx0, this.cx1, easeInOutExpo(n));
			this.cy = lerp(this.cy0, this.cy1, easeInOutExpo(n));
		}
		if (this.t > this.t1) {
			this.init();
		}
		this.t++;
	}

	init() {
		this.drc = int(random(5));
		while (this.drc == this.pdrc) {
			this.drc = int(random(5));
		}
		this.d = this.w * random(0.4, 0.75);

		this.pdrc = this.drc;
		if (this.drc == 0) {
			this.cx1 = this.x + ((this.w / 2) - (this.d / 2));
			this.cy1 = this.y + ((this.w / 2) - (this.d / 2));
		} else if (this.drc == 1) {
			this.cx1 = this.x - ((this.w / 2) - (this.d / 2));
			this.cy1 = this.y + ((this.w / 2) - (this.d / 2));
		} else if (this.drc == 2) {
			this.cx1 = this.x + ((this.w / 2) - (this.d / 2));
			this.cy1 = this.y - ((this.w / 2) - (this.d / 2));
		} else if (this.drc == 3) {
			this.cx1 = this.x - ((this.w / 2) - (this.d / 2));
			this.cy1 = this.y - ((this.w / 2) - (this.d / 2));
		} else if (this.drc == 4) {
			this.cx1 = this.x;
			this.cy1 = this.y;
		}
		this.cx0 = this.cx;
		this.cy0 = this.cy;
		this.t = 0;

	}

	run() {
		this.show();
		this.move();
	}
}