/* bark.js
 */
/* {r, g, b} spin ({r, g, b});
 **
 * Inverts colors but keeps the hue.
 * TODO: Maybe try with L/V from HSL/HSV?
 * TODO: Send pre- and pos-processing as callbacks to spin(), to memoize.
 * TODO: Make the CLUT one per browser session, instead of per-tab.
 */
let clut = {};
let spin = (color) => {
    /* Check memoization */
    if (clut [JSON.stringify (color)]) {
        return clut [JSON.stringify (color)];
        }
    let ret = {};
    /* Invert color */
    ret.r = 255 - color.r;
    ret.g = 255 - color.g;
    ret.b = 255 - color.b;
    /* Invert hue */
    ret.r = (ret.g + ret.b) / 2;
    ret.g = (ret.r + ret.b) / 2;
    ret.b = (ret.r + ret.g) / 2;
    /* Memoize */
    clut [JSON.stringify (color)] = ret;
    return ret;
    }

/* void darken ();
 **
 * FOR every element, starting at body, DO:
 * IF bg colors is brighter than 128 * 3 = 384 THEN spin it;
 * IF txt colors is darker than 384 THEN spin it;
 * LOOP.
 */
let running = false;    // Limit to a single instance
let darken = () => {
    if (running) {
        return;
        }
    else {
        running = true;
        }
    let all = document.querySelectorAll ('body, body *');
    for (let i = 0; i < all.length; i++) {
        /* bg */
        let bg = window.getComputedStyle (all[i]).backgroundColor.match(/\d+/g);
        let bgcolor = { r: Number (bg[0]),
                        g: Number (bg[1]),
                        b: Number (bg[2]) };
        if (bgcolor.r + bgcolor.g + bgcolor.b > 384) {
            bgcolor = spin (bgcolor);
            }
        /* txt */
        let txt = window.getComputedStyle (all[i]).color.match(/\d+/g);
        let txtcolor = { r: Number (txt[0]),
                        g: Number (txt[1]),
                        b: Number (txt[2]) };
        if (txtcolor.r + txtcolor.g + txtcolor.b < 384) {
            txtcolor = spin (txtcolor);
            }
        /* Post process */
        /* Limit to 5% to 100% */
        if (bgcolor.r < 13) {
            bgcolor.r *= 0.95;
            bgcolor.r += 13;
            }
        if (bgcolor.g < 13) {
            bgcolor.g *= 0.95;
            bgcolor.g += 13;
            }
        if (bgcolor.b < 13) {
            bgcolor.b *= 0.95;
            bgcolor.b += 13;
            }
        /* Apply changes */
        all[i].style.color =
                `rgb(${txtcolor.r},${txtcolor.g},${txtcolor.b})`;
        if (bg.length === 3) {
            all[i].style.backgroundColor =
                    `rgb(${bgcolor.r},${bgcolor.g},${bgcolor.b})`;
            }
        else if (bg.length === 4) {
            all[i].style.backgroundColor =
                    `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bg[3]})`;
                }
        else if (bg.length === 5) {
            all[i].style.backgroundColor =
                `rgb(${bgcolor.r},${bgcolor.g},${bgcolor.b},${bg[3]}.${bg[4]})`;
            }
        else {
            // fixme
            console.log ('Error, bg color with too many components!');
            }
        }   // for
    running = false;
    }   // darken


/* Mutation Observer
 **
 * Checks if the DOM changed and re-darken everything.
 * TODO: Check performance.
 * TODO: Re-darken only changed elements.
 */
/* Adapted from StackOverflow.
 * https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
 */
let o = (() => {
    var MutationObserver = window.MutationObserver ||
                           window.WebKitMutationObserver;

    return (node, func) => {
        if (!node || node.nodeType !== 1) {
            return; // validation
            }

        if (MutationObserver) {
            // define a new observer
            var obs = new MutationObserver ((mutations, observer) => {
                func (mutations);
                });
            // have the observer observe foo for changes in children
            obs.observe (node, { childList: true, subtree: true });
            }

        else if (window.addEventListener) {
            node.addEventListener ('DOMNodeInserted', func, false);
            node.addEventListener ('DOMNodeRemoved', func, false);
            }
        }
    })();

/* Actually add the mutation observer */
o (document.querySelector ('body'), darken);

/* Do it once */
darken ();
