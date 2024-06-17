const POSITIONS = [
  {
    left: 50, // 0, 0
    top: 50,
  },
  {
    left: 150,
    top: 0,
  },
  {
    left: 250, // 300, 0
    top: 50,
  },
  {
    left: 300,
    top: 150,
  },
  {
    left: 250, // 300, 300
    top: 250,
  },
  {
    left: 150,
    top: 300,
  },
  {
    left: 50, // 0 , 300
    top: 250,
  },
  {
    left: 0,
    top: 150,
  },
];

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    let withEventHandler = false;
    let pos = 0;

    const button = document.getElementById("event-button");
    const innerBlock = document.getElementById('inner-block');
    const inner2Block = document.getElementById('inner2-block');
    // const outerBlock = document.getElementById("outer-block");
    // const innerBlock = document.createElement("div");
    // innerBlock.className = "inner-block";
    // outerBlock.append(innerBlock);

    const innerBlockClickHandler = () => {
      pos = ++pos % 8;
      //console.log(pos);
      innerBlock.style.top = `${POSITIONS[pos].top}px` ;
      innerBlock.style.left = `${POSITIONS[pos].left}px`;
      inner2Block.style.top = `${POSITIONS[pos].top}px` ;
      inner2Block.style.left = `${POSITIONS[pos].left}px`;
    };

    const inner2BlockClickHandler = () => {
      pos = --pos % 8;
      if(pos === -1) pos = 7;
      console.log(pos);
      innerBlock.style.top = `${POSITIONS[pos].top}px` ;
      innerBlock.style.left = `${POSITIONS[pos].left}px`;
      inner2Block.style.top = `${POSITIONS[pos].top}px` ;
      inner2Block.style.left = `${POSITIONS[pos].left}px`;
    };
  
    // const outerBlockClickHandler = (event) => {
    //   if (event.target === innerBlock) {
    //     pos = ++pos % 8;
    //     event.target.style.top = `${POSITIONS[pos].top}px`;
    //     event.target.style.left = `${POSITIONS[pos].left}px`;
    //   }
    // };

    button.addEventListener("click", () => {
      withEventHandler = !withEventHandler;
      button.innerHTML = withEventHandler ? "Remove Block" : "Add Block";
      if (withEventHandler) {
        // outerBlock.addEventListener("click", outerBlockClickHandler);
        innerBlock.addEventListener('click', innerBlockClickHandler);
        innerBlock.style.display = "block";
        inner2Block.addEventListener('click', inner2BlockClickHandler);
        inner2Block.style.display = "block";
      } 
      else {
        // outerBlock.removeEventListener("click", outerBlockClickHandler);
        innerBlock.removeEventListener('click', innerBlockClickHandler);
        innerBlock.style.display = "none";
        inner2Block.removeEventListener('click', inner2BlockClickHandler);
        inner2Block.style.display = "none";
      }
    });
  });
})();
