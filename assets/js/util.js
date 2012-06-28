function Point2D(n, t) {
    if (!1 == this instanceof Point2D) return new Point2D(n, t);
    this.x = n, this.y = t
}
function Line2D() {
    if (!1 == this instanceof Line2D) return new Line2D;
    this.Points = [], this.numPts = 0, this.parent = null, this.closed = !0, this.text = "", this.textX = 0, this.textY = 0, this.AddSegment = function (n, t, i, r) {
        var f = this.AddPt(n, t),
            u = this.AddPt(i, r);
        return this.numPts
    }, this.AddPt = function (n, t) {
        var i = new Point2D(n, t);
        return this.numPts = this.Points.push(i), i
    }, this.Draw = function (n, t) {
        var r, i;
        if (this.Points.length >= 2) {
            for (r = this.Points[0], this.closed && n.beginPath(), n.moveTo(r.x + this.parent.GetPinX(), r.y + this.parent.GetPinY()), i = 1; i < this.Points.length; i++) CurrPt = this.Points[i], n.lineTo(CurrPt.x + this.parent.GetPinX(), CurrPt.y + this.parent.GetPinY());
            this.closed && n.closePath(), t && (n.fillStyle = this.parent.fillStyle, n.fill(), this.parent.ParentSelected() || this.parent.Highlighted() ? (n.lineWidth = 3, n.strokeStyle = "#0000ff") : (n.lineWidth = 1, n.strokeStyle = "#000000"), n.stroke(), this.text && (n.textAlign = "center", n.textBaseline = "middle", n.strokeStyle = "#000", n.lineWidth = 1, n.strokeText(this.text, this.textX + this.parent.pinx, this.textY + this.parent.piny)))
        }
    }
}
function Shape(n) {
    if (!1 == this instanceof Shape) return new Shape;
    this.text = n, this.name = "", this.GUID = "", this.parent = null, this.page = null, this.fillStyle = "rgb(255,255,255)", this.pinx = 0, this.piny = 0, this.width = 0, this.height = 0, this.selectable = !0, this.IsGridShape = !1, this.isConnector = !1, this.isSelected = !1, this.touchNum = -1, this.canvas = null, this.context = null, this.CxTo = [], this.CxFrom = [], this.GluedShapes = [], this.GluedShapesC = [], this.Lines = [], this.AddLine = function () {
        var n = new Line2D,
            t = this.Lines.push(n);
        return n.parent = this, n
    }, this.GetPinX = function () {
        return this.parent ? this.parent.GetPinX() + this.pinx : this.pinx
    }, this.mouseIsOverMe = !1, this.Highlighted = function () {
        return this.parent ? this.parent.Highlighted() : this.mouseIsOverMe
    }, this.ParentSelected = function () {
        return this.parent ? this.parent.ParentSelected() : this.isSelected
    }, this.GetPinY = function () {
        return this.parent ? this.parent.GetPinY() + this.piny : this.piny
    }, this.AddGluedShape = function (n) {
        this.GluedShapes.push(n), n.parent = this
    }, this.setUpCircleAnim = function (n, t) {
        this.centerx = this.pinx, this.centery = this.piny, this.theta = 0, this.selectable = !1, this.animRadiusX = n, this.animRadiusY = t
    }, this.updateXYFromTheta = function () {
        this.animRadiusX && (this.pinx = this.centerx + this.animRadiusX * Math.cos(this.theta), this.pinx > this.page.canvas.width - this.width / 2 && (this.pinx = this.page.canvas.width - this.width / 2), this.pinx < this.width / 2 && (this.pinx = this.width / 2)), this.animRadiusY && (this.piny = this.centery + this.animRadiusY * Math.sin(this.theta), this.piny > this.page.canvas.height - this.height / 2 && (this.piny = this.page.canvas.height - this.height / 2), this.piny < this.height / 2 && (this.piny = this.height / 2))
    }, this.draw = function (n) {
        var r, i, e, o, s, u, t, h, f;
        for (this.isConnector && this.CxFrom.length > 0 && this.CxTo.length > 0 && (r = this.CxFrom[0], i = this.CxTo[0], this.context.strokeStyle = "#000000", r.isCircle ? (e = r.pinx, o = r.piny) : (e = r.pinx + .5 * r.width, o = r.piny), i.isCircle ? (s = i.pinx, u = i.piny) : (s = i.pinx - .5 * i.width, u = i.piny), this.context.moveTo(e, o), this.context.lineTo(s, u), n && this.context.stroke()), this.isCircle && (this.context.beginPath(), this.context.arc(this.GetPinX(), this.GetPinY(), this.radius, 0, Math.PI * 2, !1), this.context.closePath(), this.ParentSelected() || this.isSelected ? (this.context.lineWidth = 3, this.context.strokeStyle = "#0000ff") : (this.context.lineWidth = 1, this.context.strokeStyle = "#000000"), this.context.stroke(), this.context.fillStyle = this.fillStyle, this.context.fill()), t = 0; t < this.Lines.length; t++) h = this.Lines[t], h.Draw(this.context, n);
        for (this.context.textAlign = "center", this.context.textBaseline = "middle", this.context.strokeStyle = "#000000", this.context.lineWidth = 1, this.context.strokeText(this.text, this.GetPinX(), this.GetPinY()), t = 0; t < this.GluedShapes.length; t++) f = this.GluedShapes[t], f && f.draw(n)
    }, this.makeCircle = function (n) {
        this.radius = n, this.isCircle = !0, this.width = 2 * n, this.height = 2 * n
    }, this.MakeRectangle = function () {
        var i, t, n;
        while (this.Lines.length > 0) i = this.Lines.pop();
        return t = this.AddLine(), n = t.AddSegment(-.5 * this.width, -.5 * this.height, .5 * this.width, -.5 * this.height), n = t.AddSegment(.5 * this.width, -.5 * this.height, .5 * this.width, .5 * this.height), n = t.AddSegment(.5 * this.width, .5 * this.height, -.5 * this.width, .5 * this.height), n = t.AddSegment(-.5 * this.width, .5 * this.height, -.5 * this.width, -.5 * this.height)
    }, this.AddCxTo = function (n) {
        return this.CxTo.push(n), this.CxTo.length
    }, this.AddCxFrom = function (n) {
        return this.CxFrom.push(n), this.CxFrom.length
    }, this.SetContext = function (n) {
        this.context = n.getContext("2d")
    }, this.IsInBounds = function (n, t) {
        if (n <= this.GetPinX() + .5 * this.width && n >= this.GetPinX() - .5 * this.width && t <= this.GetPinY() + .5 * this.height && t >= this.GetPinY() - .5 * this.height) return !0;
        for (var i = 0; i < this.GluedShapes.length; i++) if (this.GluedShapes[i].IsInBounds(n, t)) return !0
    }
}
function DrwPage() {
    function f(t) {
        n(t), thePage && thePage.deselectAll(), thePage.draw()
    }
    function u(n) {
        var r;
        if (n.touches.length == 1) {
            r = 0, n.preventDefault();
            var i = n.touches[r],
                u = getCursorPosition(i),
                u = getCursorPosition(i),
                t = thePage.GetShapeAtLoc(u.x, u.y);
            t ? (thePage && (thePage.ActiveShape = t), this.ActiveShape = t, t.isSelected = !0, t.onSelectAction && t.onSelectAction(), this.ShapeSelected && this.ShapeSelected(this.ActiveShape), this.xoff = i.pageX - t.pinx, this.yoff = i.pageY - t.piny) : (this.ActiveShape = null, thePage && (thePage.ActiveShape = null), thePage.onDeselect && thePage.onDeselect()), thePage && thePage.draw()
        }
    }
    function e(n) {
        var t = n.which;
        t == undefined && (t = n.keyCode), alert("The Unicode key code of the released key: " + t)
    }
    function i() {}
    function t(n) {
        var i = getCursorPosition(n),
            t = thePage.GetShapeAtLoc(i.x, i.y),
            r;
        t ? (this.ActiveShape && (this.ActiveShape.isSelected = !1, r = !0), this.ActiveShape = t, thePage && (thePage.ActiveShape = t), t.isSelected = !0, thePage.draw(), t.onSelectAction && t.onSelectAction(), this.xoff = i.x - t.pinx, this.yoff = i.y - t.piny, this.ShapeSelected && this.ShapeSelected(this.ActiveShape)) : (this.ActiveShape && (this.ActiveShape.isSelected = !1), this.ActiveShape = null, thePage && (thePage.ActiveShape = null), thePage.onDeselect && thePage.onDeselect(), thePage && thePage.draw())
    }
    function n() {
        this.ActiveShape && (this.ActiveShape.isSelected = !1, this.ActiveShape = null)
    }
    function r(n) {
        var t = getCursorPosition(n);
        this.ActiveShape && this.HoveredShp && (this.HoveredShp.mouseIsOverMe = !1, this.HoveredShp = null, thePage.setAllShpsNoMouseOver());
        return
    }
    if (!1 == this instanceof DrwPage) return new DrwPage;
    this.height = function () {
        return this.canvas.height
    }, this.width = function () {
        return this.canvas.width
    }, this.canvas = null, this.context = null, this.Shapes = [], this.TouchedShapes = [null, null, null, null, null], this.NewShape = function () {
        var n = new Shape(""),
            t;
        return n.page = this, t = this.Shapes.push(n), n
    }, this.AddShape = function (n) {
        n.page = this;
        return this.Shapes.push(n)
    }, this.setAllShpsNoMouseOver = function () {
        for (var n = 0; n < this.Shapes.length; n++) this.Shapes[n].mouseIsOverMe = !1
    }, this.getShapeByGUID = function (n) {
        for (var i, t = 0; t < this.Shapes.length; t++) {
            i = this.Shapes[t];
            if (n === i.GUID) return i
        }
    }, this.Grid = function (n, t) {
        n && (this.GridHoriz = n), t && (this.GridVert = t)
    }, this.GetShapeAtLoc = function (n, t) {
        for (var i = 0; i < this.Shapes.length; i++) if (this.Shapes[i].selectable) if (!this.IsGridShape) if (this.Shapes[i].IsInBounds(n, t)) return this.Shapes[i]
    }, this.draw = function () {
        var i, r, u, t, n;
        this.canvas.getContext("2d"), this.context = this.canvas.getContext("2d"), this.canvas.width = this.canvas.width;
        if (this.GridHoriz) {
            for (i = this.width(), this.HGridHorizStop && (i = this.HGridHorizStop), r = this.HGridVertStop ? Math.ceil(this.HGridVertStop / this.GridHoriz) : Math.ceil(this.height() / this.GridHoriz), n = 0; n <= r; n++) this.context.moveTo(.5, n * this.GridHoriz + .5), this.context.lineTo(i + .5, n * this.GridHoriz + .5);
            this.context.strokeStyle = "rgb(25,25,25)", this.context.stroke()
        }
        if (this.GridVert) {
            for (u = this.height(), this.VGridVertStop && (u = this.VGridVertStop), t = 1, t = this.VGridHorizStop ? Math.ceil(this.VGridHorizStop / this.GridVert) : Math.ceil(this.width() / this.GridVert), n = 0; n <= t; n++) this.context.moveTo(n * this.GridVert + .5, .5), this.context.lineTo(n * this.GridVert + .5, u + .5);
            this.context.strokeStyle = "rgb(25,25,25)", this.context.stroke()
        }
        for (n = 0; n < this.Shapes.length; n++) this.Shapes[n].isConnector && this.Shapes[n].draw(!0);
        for (n = 0; n < this.Shapes.length; n++) this.Shapes[n].isConnector || this.Shapes[n].draw(!0)
    }, this.deselectAll = function () {
        for (var n = 0; n < this.Shapes.length; n++) this.Shapes[n].isSelected = !1
    }, this.setCanvas = function (o) {
        this.canvas = o, isIphone() ? (o.ontouchstart = u, o.ontouchend = f) : isIE() === !1 ? (o.onmousedown = t, o.onmouseup = n, o.onmousemove = r, o.ondblclick = i, o.onkeydown = e) : (o.attachEvent("onmousedown", t), o.attachEvent("onmouseup", n))
    }, this.HoveredShp = null
}
function getCursorPosition(n) {
    var r, i, t;
    return n.pageX != undefined && n.pageY != undefined ? (r = n.pageX, i = n.pageY) : (r = n.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, i = n.clientY + document.body.scrollTop + document.documentElement.scrollTop), r -= cnv.offsetLeft, i -= cnv.offsetTop, t = [], t.x = r, t.y = i, t
} // JavaScript Document