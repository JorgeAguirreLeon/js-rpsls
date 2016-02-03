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
      d3.select(this).attr("class", "active");
      activate_turn(d3.select(this).attr("id"));
    })
  }

  function activate_turn(selected_one) {
    if (turn_active) return;
    turn_active = true;

    var active = d3.select(".active");
    var others = d3.selectAll(".element");

    active.on("mouseenter", noop);
    active.on("mouseleave", noop);
    active.on("click", noop);
    others.on("mouseenter", noop);
    others.on("mouseleave", noop);
    others.on("click", noop);
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
            var random = pick_hand();
            d3.select(this)
              .text(random.char)
              .attr("x", random.x)
              .attr("y", random.y)
              .attr("font-size", random.fontSize)
              .transition()
                .duration(300)
                .style("opacity", 1)
                .each("end", show_result.bind(this, selected_one, random.name));
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

  function show_result(player, random) {
    var result = apply_game_logic(player, random);
    var text = svg.append("text")
      .attr("class", "result")
      .attr("text-anchor", "middle")
      .attr("x", 1500)
      .attr("y", 450)
      .attr("font-size", 80);
    text.append("tspan")
      .attr("fill", result.result === "lose" ? "#990099" : "#999900")
      .text(result.first.toUpperCase());
    text.append("tspan")
      .attr("dx", 25)
      .attr("fill", "gray")
      .attr("font-size", 60)
      .text(result.middle.toUpperCase());
    text.append("tspan")
      .attr("dx", 25)
      .attr("fill", result.result === "lose" ? "#999900" : "#990099")
      .text(result.second.toUpperCase());

    var final_result = "YOU " + result.result.toUpperCase();
    if (result.result == "tie") final_result = "YOU'VE TIED!";
    svg.append("text")
      .attr("class", "result " + result.result)
      .attr("text-anchor", "middle")
      .attr("x", 1500)
      .attr("y", 900)
      .attr("font-size", 80)
      .text(final_result);
    svg.append("text")
      .attr("class", "result " + result.result)
      .attr("text-anchor", "middle")
      .attr("x", 1500)
      .attr("y", 950)
      .attr("font-size", 30)
      .attr("cursor", "pointer")
      .text("CLICK HERE TO PLAY AGAIN")
      .on("mouseenter", function() {
        d3.select(this).style("text-decoration", "underline");
      })
      .on("mouseleave", function() {
        d3.select(this).style("text-decoration", null);
      })
      .on("click", function() {
        d3.select(".main").remove();
        play_it();
      });
  }

  function apply_game_logic(player, random) {
    //Case I: SAME PICK
    if (player === random) {
      return {first: player, second: random, middle: "ties", result: "tie"};
    }
    //Case II: SCISSORS VS PAPER
    else if (player === "scissors" && random === "paper") {
      return {first: "scissors", second: "paper", middle: "cuts", result: "win"}
    }
    else if (random === "scissors" && player === "paper") {
      return {first: "scissors", second: "paper", middle: "cuts", result: "lose"}
    }
    // Case III: PAPER VS ROCK
    else if (player === "paper" && random === "rock") {
      return {first: "paper", second: "rock", middle: "covers", result: "win"}
    }
    else if (random === "paper" && player === "rock") {
      return {first: "paper", second: "rock", middle: "covers", result: "lose"}
    }
    // Case IV: ROCK VS LIZARD
    else if (player === "rock" && random === "lizard") {
      return {first: "rock", second: "lizard", middle: "crushes", result: "win"}
    }
    else if (random === "rock" && player === "lizard") {
      return {first: "rock", second: "lizard", middle: "crushes", result: "lose"}
    }
    // Case V: LIZARD VS SPOCK
    else if (player === "lizard" && random === "spock") {
      return {first: "lizard", second: "spock", middle: "poisons", result: "win"}
    }
    else if (random === "lizard" && player === "spock") {
      return {first: "lizard", second: "spock", middle: "poisons", result: "lose"}
    }
    // Case V: SPOCK VS SCISSORS
    else if (player === "spock" && random === "scissors") {
      return {first: "spock", second: "scissors", middle: "smashes", result: "win"}
    }
    else if (random === "spock" && player === "scissors") {
      return {first: "spock", second: "scissors", middle: "smashes", result: "lose"}
    }
    // Case VI: SCISSORS VS LIZARD
    else if (player === "scissors" && random === "lizard") {
      return {first: "scissors", second: "lizard", middle: "decapitates", result: "win"}
    }
    else if (random === "scissors" && player === "lizard") {
      return {first: "scissors", second: "lizard", middle: "decapitates", result: "lose"}
    }
    // Case VII: LIZARD VS PAPER
    else if (player === "lizard" && random === "paper") {
      return {first: "lizard", second: "paper", middle: "eats", result: "win"}
    }
    else if (random === "lizard" && player === "paper") {
      return {first: "lizard", second: "paper", middle: "eats", result: "lose"}
    }
    // Case VIII: PAPER VS SPOCK
    else if (player === "paper" && random === "spock") {
      return {first: "paper", second: "spock", middle: "disproves", result: "win"}
    }
    else if (random === "paper" && player === "spock") {
      return {first: "paper", second: "spock", middle: "disproves", result: "lose"}
    }
    // Case IX: SPOCK VS ROCK
    else if (player === "spock" && random === "rock") {
      return {first: "spock", second: "rock", middle: "vaporizes", result: "win"}
    }
    else if (random === "spock" && player === "rock") {
      return {first: "spock", second: "rock", middle: "vaporizes", result: "lose"}
    }
    // Case X: ROCK VS SCISSORS
    else if (player === "rock" && random === "scissors") {
      return {first: "rock", second: "scissors", middle: "crushes", result: "win"}
    }
    else if (random === "rock" && player === "scissors") {
      return {first: "rock", second: "scissors", middle: "crushes", result: "lose"}
    }
  }

  function noop() {}
}

play_it();
