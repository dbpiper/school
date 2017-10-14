class BoundingBox {
  constructor(left, right, top, bottom) {
    this.topLeft = [left, top];
    this.topRight = [right, top];
    this.bottomLeft = [left, bottom];
    this.bottomRight = [right, bottom];
  }

  static overlap(bb1, bb2) {
      return (
        bb1.contains(bb2) ||
        bb2.contains(bb1)
      );
  }

  // checks to see if the bounding box contains any vertex from
  // another bounding box
  contains(bb) {
    return (
      this.contains(bb.topLeft) ||
      this.contains(bb.topRight) ||
      this.contains(bb.bottomLeft) ||
      this.contains(bb.bottomRight)
    );
  }

  // checks to see if the bounding box contains a point
  containsPoint(point) {
    return (
      point[1] <= this.getTop() &&
      point[1] >= this.getBottom() &&
      point[0] <= this.getRight() &&
      point[0] >= this.getLeft()
    );
  }

  static translatePoint(point, tx, ty) {
    var x = point[0] + tx;
    var y = point[1] + ty;
    return [x, y];
  }
  static scalePoint(point, sx, sy) {
    var x = point[0] * sx;
    var y = point[1] * sy;
    return [x, y];
  }
  // takes angle in degrees
  // rotates about z-axis
  static rotatePoint(point, angle) {
    var angleInRad = angle * (Math.PI/180);
    var x = point[0] * Math.cos(angleInRad) - point[1] * Math.sin(angleInRad);
    var y = point[0] * Math.sin(angleInRad) + point[1] * Math.cos(angleInRad);
    return [x, y];
  }
  translate(tx, ty) {
      this.topLeft = BoundingBox.translatePoint(this.topLeft, tx, ty);
      this.topRight = BoundingBox.translatePoint(this.topRight, tx, ty);
      this.bottomLeft = BoundingBox.translatePoint(this.bottomLeft, tx, ty);
      this.bottomRight = BoundingBox.translatePoint(this.bottomRight, tx, ty);
  }
  scale(sx, sy) {
      this.topLeft = BoundingBox.scalePoint(this.topLeft, sx, sy);
      this.topRight = BoundingBox.scalePoint(this.topRight, sx, sy);
      this.bottomLeft = BoundingBox.scalePoint(this.bottomLeft, sx, sy);
      this.bottomRight = BoundingBox.scalePoint(this.bottomRight, sx, sy);
  }
  // takes angle in degrees
  rotate(angle) {
      this.topLeft = BoundingBox.rotatePoint(this.topLeft, angle);
      this.topRight = BoundingBox.rotatePoint(this.topRight, angle);
      this.bottomLeft = BoundingBox.rotatePoint(this.bottomLeft, angle);
      this.bottomRight = BoundingBox.rotatePoint(this.bottomRight, angle);
  }
  getTop() {
    var largestY = this.topLeft[1];
    if (this.topRight[1] > largestY) {
      largestY = this.topRight[1];
    }
    if (this.bottomLeft[1] > largestY) {
      largestY = this.bottomLeft[1];
    }
    if (this.bottomRight[1] > largestY) {
      largestY = this.bottomRight[1];
    }
    return largestY;
  }
  getBottom() {
    var smallestY = this.topLeft[1];
    if (this.topRight[1] < smallestY) {
      smallestY = this.topRight[1];
    }
    if (this.bottomLeft[1] < smallestY) {
      smallestY = this.bottomLeft[1];
    }
    if (this.bottomRight[1] < smallestY) {
      smallestY = this.bottomRight[1];
    }
    return smallestY;
  }
  getLeft() {
    var smallestX = this.topLeft[0];
    if (this.topRight[0] < smallestX) {
      smallestX = this.topRight[0];
    }
    if (this.bottomLeft[0] < smallestX) {
      smallestX = this.bottomLeft[0];
    }
    if (this.bottomRight[0] < smallestX) {
      smallestX = this.bottomRight[0];
    }
    return smallestX;
  }
  getRight() {
    var largestX = this.topLeft[0];
    if (this.topRight[0] > largestX) {
      largestX = this.topRight[0];
    }
    if (this.bottomLeft[0] > largestX) {
      largestX = this.bottomLeft[0];
    }
    if (this.bottomRight[0] > largestX) {
      largestX = this.bottomRight[0];
    }
    return largestX;
  }
}
