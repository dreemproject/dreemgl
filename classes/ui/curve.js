define.class('$ui/view', function(){

    this.attributes = {
        linewidth: Config({type:float, value:4, duration:0.5, motion:"bounce"}),
        glowlinewidth: Config({type:float, value:3, duration:0.5, motion:"bounce"}),
        color1: Config({type:vec4, value:vec4("cornflowerblue"),motion:"linear", duration: 0.1}),
        color2: Config({type:vec4, value:vec4("pink"),motion:"linear", duration: 0.1}),
        from: Config({type:vec2, value:vec2(0,0)}),
        to: Config({type:vec2, value:vec2(100,100)})
    };
    this.pickalpha = -1;

    this.B1 = function (t) { return t * t * t; }
    this.B2 = function (t) { return 3 * t * t * (1 - t); }
    this.B3 = function (t) { return 3 * t * (1 - t) * (1 - t); }
    this.B4 = function (t) { return (1 - t) * (1 - t) * (1 - t); }

    this.bezier = function(percent,C1,C2,C3,C4) {

        var b1 = this.B1(percent);
        var b2 = this.B2(percent);
        var b3 = this.B3(percent);
        var b4 = this.B4(percent);

        var A1 = vec2.vec2_mul_float32(C1, b1 );
        var A2 = vec2.vec2_mul_float32(C2, b2 );
        var A3 = vec2.vec2_mul_float32(C3, b3 );
        var A4 = vec2.vec2_mul_float32(C4, b4 );

        return vec2.add(A1, vec2.add(A2, vec2.add(A3, A4)));
    };

    this.noboundscheck = true;

    this.init = function(){
        this.neutralcolor1 = this.color1;
        this.neutralcolor2 = this.color2;
        this.neutralcolor = this.neutrallinewidth = this.linewidth;
        this.updatecount = 0;
    };

    this.updatecolor = function(){
        this.color1 = this.neutralcolor1;
        this.color2 = this.neutralcolor2;
        this.linewidth = this.neutrallinewidth;
    };

    this.bgcolor = NaN;

    define.class(this, "connectionshader", this.Shader,function($ui$, view){
        this.mesh = vec2.array();

        for(var i = 0;i<100;i++){
            this.mesh.push([i/100.0,-0.5]);
            this.mesh.push([i/100.0, 0.5])
        }

        this.drawtype = this.TRIANGLE_STRIP;

        this.B1 = function (t) { return t * t * t; }
        this.B2 = function (t) { return 3 * t * t * (1 - t); }
        this.B3 = function (t) { return 3 * t * (1 - t) * (1 - t); }
        this.B4 = function (t) { return (1 - t) * (1 - t) * (1 - t); }

        this.bezier = function(percent,C1,C2,C3,C4) {
            var b1 = B1(percent);
            var b2 = B2(percent);
            var b3 = B3(percent);
            var b4 = B4(percent);
            return C1* b1 + C2 * b2 + C3 * b3 + C4 * b4;
        };

        this.position = function(){
            var a = mesh.x;
            var a2 = mesh.x+0.001;
            var b = mesh.y * view.linewidth;

            var ddp = view.to - view.from;

            var curve = min(100.,length(ddp)/2);
            posA = this.bezier(a, view.from, view.from + vec2(curve,0), view.to - vec2(curve,0), view.to);
            posB = this.bezier(a2, view.from, view.from + vec2(curve,0), view.to - vec2(curve,0), view.to);

            var dp = normalize(posB - posA);

            var rev = vec2(-dp.y, dp.x);
            posA += rev * b;
            //pos = vec2(mesh.x * view.layout.width, mesh.y * view.layout.height)
            return vec4(posA, 0, 1) * view.totalmatrix * view.viewmatrix
        };

        this.color = function(){
            //return 'blue'
            var a= 1.0 - pow(abs(mesh.y*2.0), 2.5);
            return vec4(vec3(0.01) + mix(view.color1.xyz,view.color2.xyz, mesh.x)*1.1,a);
//            return vec4(view.bgcolor.xyz,a);
        }
    })

    define.class(this, "glowconnectionshader", this.Shader,function($ui$, view){
        this.mesh = vec2.array()

        for(var i = 0;i<100;i++){
            this.mesh.push([i/100.0,-0.5])
            this.mesh.push([i/100.0, 0.5])
        }

        this.drawtype = this.TRIANGLE_STRIP

        this.B1 = function (t) { return t * t * t; }
        this.B2 = function (t) { return 3 * t * t * (1 - t); }
        this.B3 = function (t) { return 3 * t * (1 - t) * (1 - t); }
        this.B4 = function (t) { return (1 - t) * (1 - t) * (1 - t); }

        this.bezier = function(percent,C1,C2,C3,C4) {
            var b1 = B1(percent);
            var b2 = B2(percent);
            var b3 = B3(percent);
            var b4 = B4(percent);
            return C1* b1 + C2 * b2 + C3 * b3 + C4 * b4;
        };

        this.position = function(){
            var a = mesh.x;
            var a2 = mesh.x+0.001;
            var b = mesh.y * view.glowlinewidth;

            var ddp = view.to - view.from;

            var curve = min(100.,length(ddp)/2);
            posA = this.bezier(a, view.from, view.from + vec2(curve,0), view.to - vec2(curve,0), view.to);
            posB = this.bezier(a2, view.from, view.from + vec2(curve,0), view.to - vec2(curve,0), view.to);

            var dp = normalize(posB - posA);

            var rev = vec2(-dp.y, dp.x);
            posA += rev * b;
            //pos = vec2(mesh.x * view.layout.width, mesh.y * view.layout.height)
            return vec4(posA, 0, 1) * view.totalmatrix * view.viewmatrix
        };
        //this.color_blend = 'src_alpha * src_color + dst_color'

        this.color = function(){
            //return 'red'
            var a= 1.0-pow(abs(mesh.y*2.0), 2.5);
            return vec4(mix(view.color1.xyz,view.color2.xyz, mesh.x),a*0.3);
//            return vec4(vec3(0.0) + view.bgcolor.xyz*1.0,a);
        }
    });

    // turn on the shaders
    this.connectionshader = true
    this.glowconnectionshader = false

    this.calculateposition = function(){
        if (color1 && !color2) color2 = color1;else if (color2 && !color1) color1 = color2;
        if (color1) this.neutralcolor1 = this.color1 = Mark(color1, !this.updatecount);
        if (color2) this.neutralcolor2 = this.color2 = Mark(color2, !this.updatecount);
//        this.centralcolor = Mark(mix(this.color1, this.color2, 0.5), !this.updatecount);
        this.updatecount++;
    }
})
