function play_it() {

  var turn_active = false;

  var svg = d3.select("body")
    .append("div")
    .attr("class", "main")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 3000 1000")
      .attr("preserveAspectRatio", "xMidYMid meet");

  var mystery = svg.append("g");

  mystery
    .append("circle")
      .attr("cx", 1500)
      .attr("cy", 180)
      .attr("r", 100)
      .attr("stroke-width", 20)
      .attr("stroke", "#990099")
      .attr("fill", "transparent");

  mystery
    .append("text")
      .attr("x", 1495)
      .attr("y", 255)
      .attr("text-anchor", "middle")
      .attr("font-size", 200)
      .attr("fill", "#990099")
      .text('\uf128');

  mystery.on("mouseenter", function() {
    d3.select(this).select("circle")
      .transition()
        .duration(500)
        .attr("stroke-width", 24)
        .attr("r", 120);
    d3.select(this).select("text")
      .transition()
        .duration(500)
        .attr("font-size", 240)
        .attr("y", 265);
  });

  mystery.on("mouseleave", function() {
    d3.select(this).select("circle")
      .transition()
        .duration(500)
        .attr("stroke-width", 20)
        .attr("r", 100);
    d3.select(this).select("text")
      .transition()
        .duration(500)
        .attr("font-size", 200)
        .attr("y", 255);
  });


  var rock = svg.append("g").attr("class", "element").attr("id", "rock");
  var paper = svg.append("g").attr("class", "element").attr("id", "paper");
  var scissors = svg.append("g").attr("class", "element").attr("id", "scissors");
  var lizard = svg.append("g").attr("class", "element").attr("id", "lizard");
  var spock = svg.append("g").attr("class", "element").attr("id", "spock");

  place(rock, 500, 840, '\uf255', 495, 900, 180);
  place(paper, 1000, 720, '\uf256', 1000, 770, 160);
  place(scissors, 1500, 680, '\uf257', 1500, 730, 150);
  place(lizard, 2000, 720, '\uf258', 2000, 765, 120);
  place(spock, 2500, 840, '\uf259', 2500, 890, 150);



  function place(element, x, y, text, xText, yText, fontsize) {

    element.style("cursor", "pointer");

    element
      .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 100)
        .attr("stroke-width", 20)
        .attr("stroke", "#000099")
        .attr("fill", "transparent");

    element
      .append("text")
        .attr("x", xText)
        .attr("y", yText)
        .attr("text-anchor", "middle")
        .attr("font-size", fontsize)
        .attr("fill", "#000099")
        .text(text);

    element.on("mouseenter", function() {
      d3.select(this).select("circle")
        .transition()
          .duration(300)
          .attr("stroke", "#999900");
      d3.select(this).select("text")
        .transition()
          .duration(300)
          .attr("fill", "#999900");
    })

    element.on("mouseleave", function() {
      d3.select(this).select("circle")
        .transition()
          .duration(300)
          .attr("stroke", "#000099");
      d3.select(this).select("text")
        .transition()
          .duration(300)
          .attr("fill", "#000099");
    })

    element.on("click", function() {
      activate_turn(d3.select(this).attr("id"));
    })
  }

  function activate_turn(selected_one) {
    if (turn_active) return;
    turn_active = true;

    var active = d3.select("#" + selected_one);
    var others = d3.selectAll(".element:not(#" + selected_one + ")");

    active.on("mouseenter", noop);
    active.on("mouseleave", noop);
    others.on("mouseenter", noop);
    others.on("mouseleave", noop);
    mystery.on("mouseenter", noop);
    mystery.on("mouseleave", noop);

    var x_movement = 1500 - active.select("circle").attr("cx");
    var y_movement = 650 - active.select("circle").attr("cy");
    active.select("circle")
      .transition()
        .duration(500)
        .attr("cx", 1500)
        .attr("cy", 650);
    active.select("text")
      .transition()
        .duration(500)
        .attr("x", +active.select("text").attr("x") + x_movement)
        .attr("y", +active.select("text").attr("y") + y_movement);

    others.transition()
      .duration(500)
      .style("opacity", 0)
      .each("end", function() { d3.select(this).remove() });

      mystery.select("text")
        .transition()
          .delay(800)
          .duration(300)
          .style("opacity", 0)
          .each("end", function() {
            var random_hand = pick_hand();
            d3.select(this)
              .text(random_hand.char)
              .attr("x", random_hand.x)
              .attr("y", random_hand.y)
              .attr("font-size", random_hand.fontSize)
              .transition()
                .duration(300)
                .style("opacity", 1);
          });
  }

  function pick_hand() {
    var possibilities = [
      { name: "rock",  char:'\uf255', x: 1495, y: 235, fontSize: 180 },
      { name: "paper", char: '\uf256', x: 1500, y: 235, fontSize: 160 },
      { name: "scissors", char: '\uf257', x: 1500, y: 235, fontSize: 150 },
      { name: "lizard", char: '\uf258', x: 1500, y: 225, fontSize: 120 },
      { name: "spock", char: '\uf259', x: 1500, y: 235, fontSize: 150 }
    ];
    var chosen = Math.floor(Math.random() * 5);
    return possibilities[chosen];
  }

  function noop() {}
}

play_it();
