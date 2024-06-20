import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/index.html');

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [this.node.execute(async () => {
        // set viewport
        await this.page.open()
        await this.page.setViewport({width: 815, height: 600})
        return correct()
    }),
        this.page.execute(() => {
            // test #1
            // # OF NODES

            // HELPERS-->
            this.notExist = (node, parentNode = "body", nodeName) => {
                if (typeof parentNode !== "string") return !parentNode.querySelector(node)
                const element = document.body.querySelector(node)
                if (!element) return true
                if (nodeName && element.nodeName.toLowerCase() !== nodeName) return true
                const parent = element.parentElement
                return parent.nodeName.toLowerCase() !== parentNode
            };
            this.innerTextExist = (node, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                if (correctVal) return !element.innerText.trim().includes(correctVal)
                return !element.innerText || element.innerText.trim().length === 0;
            };
            this.correctAttr = (node, attr, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                if (!element) return true
                const _attr = element.getAttribute(attr)
                if (!correctVal) return !_attr || _attr.trim().length === 0
                //console.log(element[attr].toString())
                return !_attr || !_attr.includes(correctVal);
            };
            this.correctStyle = (node, prop, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                let style = getComputedStyle(element)[prop];
                // console.log(style, prop)
                if (style.includes("px") && !style.includes(" ")) {
                    style = Math.floor(style.split("px")[0]) + 1
                    correctVal = Math.floor(correctVal.split("px")[0]) + 1
                }
                return !style || style !== correctVal
            };
            this.correctStyleIn = (node, prop, correctVal) => {
                let element = node;
                if (typeof element === "string") element = document.querySelector(node);
                let style = getComputedStyle(element)[prop];
                return !style || !style.includes(correctVal)
            };
            this.exactAttr = (node, attr, correctVal) => {
                const element = document.querySelector(node)
                if (!element) return true
                let _attr = element.getAttribute(attr)
                if (!_attr) return true
                if (_attr.includes("px")) _attr = _attr.split("px")[0]
                return _attr !== correctVal
            };
            // <--HELPERS

            // check number of nodes in body
            let bodyNodes = Array.from(document.body.childNodes);
            this.innerBodyElements = bodyNodes.filter(
                e => e.nodeType === Node.ELEMENT_NODE);

            let len = this.innerBodyElements.length;
            const totalElements = 3;
            const errorMsg = `There should be ${totalElements} elements in the body of the HTML document, found: ${len}`;
            return len === totalElements ? correct() : wrong(errorMsg);

        }),
        this.page.execute(() => {
            // test #2
            // TAG EXIST

            // check if header exist
            let errorMsg = "The header tag is missing in the body of the HTML document.";
            if (this.notExist("header")) return wrong(errorMsg);

            // check if main exist
            errorMsg = "The main tag is missing in the body of the HTML document.";
            if (this.notExist("main")) return wrong(errorMsg);

            // check if footer exist
            errorMsg = "The footer tag is missing in the body of the HTML document.";
            if (this.notExist("footer")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #2.1
            // TAG ORDER

            const body = document.body.children;

            // check  header order 1st
            const header = body[0].tagName.toLowerCase();
            let errorMsg = "The header tag should be the first element in the body of the HTML document.";
            if (header !== "header") return wrong(errorMsg);

            // check main order 2nd
            const main = body[1].tagName.toLowerCase();
            errorMsg = "The main tag should be the second element in the body of the HTML document.";
            if (main !== "main") return wrong(errorMsg);

            // check if footer exist
            const footer = body[2].tagName.toLowerCase();
            errorMsg = "The footer tag should be the third element in the body of the HTML document.";
            if (footer !== "footer") return wrong(errorMsg);

            return correct()
        }),
        // test #3 removed
        // test #4 removed
        this.page.execute(() => {
            // test #5
            // HEIGHT

            // check if body has max-height
            let errorMsg = "The body tag doesn't have the correct max-height value.";
            if (this.correctStyle("body", "maxHeight", "600px")) return wrong(errorMsg)

            // check if header has min-height
            errorMsg = "The header tag doesn't have the correct min-height value.";
            if (this.correctStyle("header", "minHeight", "60px")) return wrong(errorMsg)

            // check if main has min-height
            errorMsg = "The main tag doesn't have the correct min-height value.";
            if (this.correctStyle("main", "minHeight", "360px")) return wrong(errorMsg)

            // check if footer has min-height
            errorMsg = "The footer tag doesn't have the correct min-height value.";
            if (this.correctStyle("footer", "minHeight", "180px")) return wrong(errorMsg)

            return correct()

        }),
        // test #6 removed
        // test #7 removed
        this.page.execute(() => {
            // test #8
            // NAV

            // check if nav exist
            let errorMsg = "The nav tag is missing inside the header tag.";
            if (this.notExist("nav", "header")) return wrong(errorMsg);

            // CONTAINER STYLE

            // check if nav has max-width style
            errorMsg = "The nav tag doesn't have the correct max-width value.";
            if (this.correctStyle("nav", "maxWidth", "100%")) return wrong(errorMsg)

            return correct()

        }),
        this.page.execute(() => {
            // test #9
            // NAV FLEX

            // check if nav has flex style
            let errorMsg = "The nav tag doesn't have the correct display value.";
            if (this.correctStyle("nav", "display", "flex")) return wrong(errorMsg)

            // check if nav has flex wrap style
            errorMsg = "The nav tag doesn't have the correct flex-wrap value.";
            if (this.correctStyle("nav", "flexWrap", "wrap")) return wrong(errorMsg)

            return correct()

        }),
        // test #10 removed
        this.page.execute(() => {
            // test #11
            // LINKS EXIST

            // LINK_LOGO
            // check if link logo exist
            let errorMsg = "The anchor tag with the id of 'link_logo' is missing inside the nav tag.";
            if (this.notExist("#link_logo", "nav", "a")) return wrong(errorMsg);

            // LINK_HOME
            // check if link home exist
            errorMsg = "The anchor tag with the id of 'link_home' is missing inside the nav tag.";
            if (this.notExist("#link_home", "nav", "a")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if link product exist
            errorMsg = "The anchor tag with the id of 'link_product' is missing inside the nav tag.";
            if (this.notExist("#link_product", "nav", "a")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if link contact exist
            errorMsg = "The anchor tag with the id of 'link_contact' is missing inside the nav tag.";
            if (this.notExist("#link_contact", "nav", "a")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #12
            // LINKS HREF

            // LINK_LOGO
            // check if link logo href correct
            let errorMsg = "The anchor tag with the id of 'link_logo' is missing the correct href attribute.";
            if (this.correctAttr("#link_logo", "href", "#home")) return wrong(errorMsg);

            // LINK_HOME
            // check if link home href correct
            errorMsg = "The anchor tag with the id of 'link_home' is missing the correct href attribute.";
            if (this.correctAttr("#link_home", "href", "#home")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if link product href correct
            errorMsg = "The anchor tag with the id of 'link_product' is missing the correct href attribute.";
            if (this.correctAttr("#link_product", "href", "#product")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if link contact href correct
            errorMsg = "The anchor tag with the id of 'link_contact' is missing the correct href attribute.";
            if (this.correctAttr("#link_contact", "href", "#contact")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #13
            // LINK IMG

            // check if img exist
            let errorMsg = "The image tag is missing inside the link tag with the id of 'link_logo'.";
            if (this.notExist("img", "a")) return wrong(errorMsg);

            // check if img has correct src
            errorMsg = "The image tag in '#link_logo' doesn't have an src attribute value.";
            if (this.exactAttr("img", "width", "64")) return wrong(errorMsg);

            // check if img has correct width
            errorMsg = "The image tag in '#link_logo' doesn't have the correct width attribute value.";
            if (this.exactAttr("img", "height", "64")) return wrong(errorMsg);

            // check if img has correct height
            errorMsg = "The image tag in '#link_logo' doesn't have the correct height attribute value.";
            if (this.correctAttr("img", "height", "64")) return wrong(errorMsg);

            // check if img has correct title
            errorMsg = "The image tag in '#link_logo' doesn't have a title attribute value.";
            if (this.correctAttr("img", "title", "")) return wrong(errorMsg);

            // check if img has correct alt
            errorMsg = "The image tag in '#link_logo' doesn't have an alt attribute value.";
            if (this.correctAttr("img", "alt", "")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #14
            // LINKS INNER TEXT

            // LINK_HOME
            // check if link home inner-text correct
            let errorMsg = "The anchor tag with the id of 'link_home' doesn't have the correct inner-text.";
            if (this.innerTextExist("#link_home", "Home")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if link product inner-text correct
            errorMsg = "The anchor tag with the id of 'link_product' doesn't have the correct inner-text.";
            if (this.innerTextExist("#link_product", "Product")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if link contact inner-text correct
            errorMsg = "The anchor tag with the id of 'link_contact' doesn't have the correct inner-text.";
            if (this.innerTextExist("#link_contact", "Contact")) return wrong(errorMsg);

            return correct()
        }),
        // test #15 removed
        // test #16 removed
        this.page.execute(() => {
            // test #17
            // BANNER CONTENT EXIST

            // check if home div exist
            const homeDiv = document.body.querySelector("#home");
            let errorMsg = "The div tag with the id of 'home' is missing inside the main tag.";
            if (this.notExist("#home", "main", "div")) return wrong(errorMsg);

            // check if h1 exist
            const h1 = homeDiv.querySelector("h1");
            errorMsg = "The h1 tag is missing inside the home div.";
            if (!h1) return wrong(errorMsg);

            // check if p exist
            const paragraph = homeDiv.querySelector("h1 + p");
            errorMsg = "The paragraph tag is missing after the h1 tag inside the home div.";
            if (!paragraph) return wrong(errorMsg);

            // check if anchor exist
            const anchor = homeDiv.querySelector("p + a");
            errorMsg = "The anchor tag is missing after the paragraph tag inside the home div.";
            if (!anchor) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #18
            // CONTENT INNER TEXT

            // check if h1 has inner text
            const homeDiv = document.querySelector("#home");
            let errorMsg = "The h1 tag doesn't have an inner-text.";
            if (this.innerTextExist("h1")) return wrong(errorMsg);

            errorMsg = "The paragraph tag doesn't have an inner-text.";
            if (this.innerTextExist("p")) return wrong(errorMsg);

            const anchor = homeDiv.querySelector("a");
            errorMsg = "The anchor tag doesn't have an inner-text.";
            if (this.innerTextExist(anchor)) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #19
            // HOME DIV STYLE

            // check if it has overflow hidden
            let errorMsg = "The div tag with the id of 'home' doesn't have the correct overflow value.";
            if (this.correctStyle("#home", "overflow", "hidden")) return wrong(errorMsg);

            // check if it has text center
            errorMsg = "The div tag with the id of 'home' doesn't have the correct text-align value.";
            if (this.correctStyle("#home", "text-align", "center")) return wrong(errorMsg);

            return correct()

        })
        // test #20 removed
        , this.page.execute(() => {
            // test #21
            // ANCHOR  STYLE

            // check if it has href
            const homeDiv = document.querySelector("#home");
            const anchor = homeDiv.querySelector("a");
            let errorMsg = "The anchor tag doesn't have the correct href attribute value.";
            if (this.correctAttr(anchor, "href", "#product")) return wrong(errorMsg);

            // check if it has correct border
            errorMsg = "The anchor tag doesn't have the correct border value.";
            if (this.correctStyleIn(anchor, "border", "1px solid")) return wrong(errorMsg);

            // check if it has text decoration
            errorMsg = "The anchor tag doesn't have the correct text decoration value.";
            if (this.correctStyle(anchor, "text-decoration-line", "none")) return wrong(errorMsg);

            return correct()

        }),
        this.page.execute(() => {
            // test #22
            // PRODUCT EXIST

            // check if product div  exist
            const productDiv = document.body.querySelector("#product");
            let errorMsg = "The div tag with the id of 'product' is missing inside the main tag.";
            if (this.notExist("#product", "main", "div")) return wrong(errorMsg);

            // COLS EXIST

            // check if col1 div exist
            errorMsg = "The first column div tag with the id of 'col-1' is missing inside the product div tag.";
            if (this.notExist("#col-1", productDiv, "div")) return wrong(errorMsg);

            // check if col2 div exist
            errorMsg = "The second column div tag with the id of 'col-2' is missing inside the product div tag.";
            if (this.notExist("#col-2", productDiv, "div")) return wrong(errorMsg);

            // CONTAINERS EXIST
            const colDiv1 = productDiv.querySelector("#col-1");

            // check if container1 div exist
            errorMsg = "The content-container div tag is missing inside the col-1 div tag.";
            if (this.notExist("div", colDiv1, "div")) return wrong(errorMsg);

            const colDiv2 = productDiv.querySelector("#col-2");

            // check if container1 div exist
            errorMsg = "The content-container div tag is missing inside the col-2 div tag.";
            if (this.notExist("div", colDiv2, "div")) return wrong(errorMsg);

            const containerDiv1 = colDiv1.querySelector("div");

            // check if h2  exist
            errorMsg = "The h2 tag  is missing inside the content-container div tag for col-1 div.";
            if (this.notExist("h2", containerDiv1, "h2")) return wrong(errorMsg);

            // check if p  exist
            errorMsg = "The paragraph tag  is missing inside the content-container div tag for col-1 div.";
            if (this.notExist("h2 + p", containerDiv1, "p")) return wrong(errorMsg);

            // check if img  exist
            errorMsg = "The image tag  is missing inside the col-1 div.";
            if (this.notExist("img", colDiv1, "img")) return wrong(errorMsg);

            const containerDiv2 = colDiv2.querySelector("div");

            // check if h2  exist
            errorMsg = "The h2 tag  is missing inside the first container div tag for col-2 div.";
            if (this.notExist("h2", containerDiv2, "h2")) return wrong(errorMsg);

            // check if p  exist
            errorMsg = "The paragraph tag  is missing inside the first container div tag for col-2 div.";
            if (this.notExist("h2 + p", containerDiv2, "p")) return wrong(errorMsg);

            // check if img  exist
            errorMsg = "The image tag  is missing inside the col-2 div.";
            if (this.notExist("img", colDiv2, "img")) return wrong(errorMsg);

            return correct()
        }), this.page.execute(() => {
            // test #23
            // PRODUCT  STYLE

            // check if it has display flex
            let errorMsg = "The product div tag doesn't have the correct display value.";
            if (this.correctStyle("#product", "display", "flex")) return wrong(errorMsg);

            // check if it has flex no-wrap
            errorMsg = "The product div tag doesn't have the correct flex-wrap value.";
            if (this.correctStyle("#product", "flex-wrap", "nowrap")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #24
            // COL-1  STYLE

            // check if it has text align
            let errorMsg = "The col-1 div tag doesn't have the correct text align value.";
            if (this.correctStyle("#col-1", "text-align", "center")) return wrong(errorMsg);

            // check if it has overflow hidden
            errorMsg = "The col-1 div tag doesn't have the correct overflow value.";
            if (this.correctStyle("#col-1", "overflow", "hidden")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #25
            // COL-2  STYLE

            // check if it has text align
            let errorMsg = "The col-2 div tag doesn't have the correct text align value.";
            if (this.correctStyle("#col-2", "text-align", "center")) return wrong(errorMsg);

            // check if it has text overflow hidden
            errorMsg = "The col-2 div tag doesn't have the correct overflow value.";
            if (this.correctStyle("#col-2", "overflow", "hidden")) return wrong(errorMsg);

            return correct()

        }),
        // test #26 removed
        // test #27 removed
        this.page.execute(() => {
            // test #28
            // COL1
            // H2

            const col1Div = document.body.querySelector("#col-1");
            const containerDiv1 = col1Div.querySelector("div");

            // check if it has inner text
            const h2 = containerDiv1.querySelector("h2");
            let errorMsg = "The h2 tag inside content-container div in col-1 div doesn't have an inner text.";
            if (this.innerTextExist(h2)) return wrong(errorMsg);

            // P

            // check if it has inner text
            const paragraph = containerDiv1.querySelector("p");
            errorMsg = "The paragraph tag inside content-container div in col-1 div doesn't have an inner text.";
            if (this.innerTextExist(paragraph)) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #29
            // COL2
            // H2

            const col2Div = document.body.querySelector("#col-2");
            const containerDiv1 = col2Div.querySelector("div");

            // check if it has inner text
            const h2 = containerDiv1.querySelector("h2");
            let errorMsg = "The h2 tag inside content-container div in col-2 div doesn't have an inner text.";
            if (this.innerTextExist(h2)) return wrong(errorMsg);

            // P

            // check if it has inner text
            const paragraph = containerDiv1.querySelector("p");
            errorMsg = "The paragraph tag inside content-container div in col-2 div doesn't have an inner text.";
            if (this.innerTextExist(paragraph)) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test 30
            // IMG1

            const col1Div = document.body.querySelector("#col-1");
            const img = col1Div.querySelector("img");

            // check if it has src
            let errorMsg = "The img tag inside col-1 div doesn't have an src attribute.";
            if (this.correctAttr(img, "src", "")) return wrong(errorMsg);

            // check if it has title
            errorMsg = "The img tag inside col-1 div doesn't have a title attribute.";
            if (this.correctAttr(img, "title", "")) return wrong(errorMsg);

            // check if it has alt
            errorMsg = "The img tag inside col-1 div doesn't have an alt attribute.";
            if (this.correctAttr(img, "alt", "")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test 31
            // IMG2

            const col2Div = document.body.querySelector("#col-2");
            const img = col2Div.querySelector("img");

            // check if it has src
            let errorMsg = "The img tag inside second container div in col-2 div doesn't have an src attribute value.";
            if (this.correctAttr(img, "src", "")) return wrong(errorMsg);

            // check if it has title
            errorMsg = "The img tag inside second container div in col-2 div doesn't have a title attribute value.";
            if (this.correctAttr(img, "title", "")) return wrong(errorMsg);

            // check if it has alt
            errorMsg = "The img tag inside second container div in col-2 div doesn't have an alt attribute value.";
            if (this.correctAttr(img, "alt", "")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #32
            // CONTACT EXIST

            // check if contact div  exist
            const contactDiv = document.body.querySelector("#contact");
            let errorMsg = "The div tag with the id of 'contact' is missing inside the footer tag.";
            if (this.notExist("#contact", "footer", "div")) return wrong(errorMsg);

            // COL EXIST

            // check if col div exist
            errorMsg = "The column div with the id of 'contact-col1' tag is missing inside the contact div tag.";
            if (this.notExist("#contact-col1", contactDiv, "div")) return wrong(errorMsg);

            // ANCHOR EXIST

            const colDiv = contactDiv.querySelector("#contact-col1")

            // check if anchor exist
            errorMsg = "The anchor tag with the id of 'footer_link_logo' is missing inside the column div tag.";
            if (this.notExist("#footer_link_logo", colDiv, "a")) return wrong(errorMsg);

            // check if img exist
            const linkLogo = document.body.querySelector("#footer_link_logo");
            errorMsg = "The image tag is missing inside the link tag with the id of 'footer_link_logo'.";
            if (this.notExist("img", linkLogo)) return wrong(errorMsg);

            // CONTAINER DIV

            // check if div exist
            errorMsg = "The div tag wrapping the rest of the links after the footer_link_logo anchor is missing inside" +
                " the column div tag.";
            if (this.notExist("a + div", colDiv, "div")) return wrong(errorMsg);

            // ANCHORS EXIST

            // check if anchor exist
            const wrapperDiv = colDiv.querySelector("a + div");
            errorMsg = "The anchor tag with the id of 'footer_link_home' is missing inside the wrapper div tag.";
            if (this.notExist("#footer_link_home", wrapperDiv, "a")) return wrong(errorMsg);

            // check if anchor exist
            errorMsg = "The anchor tag with the id of 'footer_link_product' is missing inside the wrapper div tag.";
            if (this.notExist("#footer_link_product", wrapperDiv, "a")) return wrong(errorMsg);

            // check if anchor exist
            errorMsg = "The anchor tag with the id of 'footer_link_contact' is missing inside the wrapper div tag.";
            if (this.notExist("#footer_link_contact", wrapperDiv, "a")) return wrong(errorMsg);

            // PARAGRAPH EXIST

            // check if p exist
            errorMsg = "The paragraph tag is missing inside the column div tag.";
            if (this.notExist("div + p", colDiv, "p")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #33
            // FOOTER STYLE

            // check if footer has max-width style
            let errorMsg = "The footer tag doesn't have the correct max-width value.";
            if (this.correctStyle("footer", "maxWidth", "100%")) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #34
            // CONTACT FLEX

            // check if contact has flex style
            let errorMsg = "The contact div tag doesn't have the correct display value.";
            if (this.correctStyle("#contact", "display", "flex")) return wrong(errorMsg)

            // check if contact has flex wrap style
            errorMsg = "The contact div tag doesn't have the correct flex-wrap value.";
            if (this.correctStyle("#contact", "flexWrap", "wrap")) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #35
            // COL STYLE

            // check if column has max-width style
            let errorMsg = "The contact col1 div tag doesn't have the correct max-width value.";
            if (this.correctStyle("#contact-col1", "maxWidth", "100%")) return wrong(errorMsg)

            return correct()

        }),
        // test #36 removed
        this.page.execute(() => {
            // test #37
            // FOOTER LINKS HREF

            // LINK_LOGO
            // check if link logo href correct
            let errorMsg = "The anchor tag with the id of 'footer_link_logo' is missing the correct href attribute.";
            if (this.correctAttr("#footer_link_logo", "href", "#home")) return wrong(errorMsg);

            // LINK_HOME
            // check if link home href correct
            errorMsg = "The anchor tag with the id of 'footer_link_home' is missing the correct href attribute.";
            if (this.correctAttr("#footer_link_home", "href", "#home")) return wrong(errorMsg);

            // LINK_PRODUCT
            // check if footer_link product href correct
            errorMsg = "The anchor tag with the id of 'footer_link_product' is missing the correct href attribute.";
            if (this.correctAttr("#footer_link_product", "href", "#product")) return wrong(errorMsg);

            // LINK_CONTACT
            // check if footer_link contact href correct
            errorMsg = "The anchor tag with the id of 'footer_link_contact' is missing the correct href attribute.";
            if (this.correctAttr("#footer_link_contact", "href", "#contact")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #38
            // LINK IMG

            // check if img has correct src
            let errorMsg = "The image tag in '#footer_link_logo' doesn't have an src attribute value.";
            if (this.correctAttr("#footer_link_logo > img", "src", "")) return wrong(errorMsg);

            // check if #footer_link_logo > img has correct width
            errorMsg = "The image tag in '#footer_link_logo' doesn't have the correct width attribute value.";
            if (this.exactAttr("#footer_link_logo > img", "width", "64")) return wrong(errorMsg);

            // check if #footer_link_logo > img has correct height
            errorMsg = "The image tag in '#footer_link_logo' doesn't have the correct height attribute value.";
            if (this.exactAttr("#footer_link_logo > img", "height", "64")) return wrong(errorMsg);

            // check if #footer_link_logo > img has correct title
            errorMsg = "The image tag in '#footer_link_logo' doesn't have a title attribute value.";
            if (this.correctAttr("#footer_link_logo > img", "title", "")) return wrong(errorMsg);

            // check if img has correct alt
            errorMsg = "The image tag in '#footer_link_logo' doesn't have an alt attribute value.";
            if (this.correctAttr("#footer_link_logo > img", "alt", "")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #39
            // WRAPPER DIV

            const wrapperDiv = document.body.querySelector("#contact-col1 > a + div");

            let errorMsg = "The div tag wrapping the rest of the links should be a direct child of the contact-col1 " +
                "div after the footer_link_logo anchor.";
            if (!wrapperDiv) return wrong(errorMsg);

            // PARAGRAPH STYLE
            const paragraph = document.body.querySelector("#contact > div > div + p");

            errorMsg = "The paragraph tag should be a direct child of the contact-col1 " +
                "div after all the footer link elements.";
            if (!paragraph) return wrong(errorMsg);

            errorMsg = "The paragraph tag after the footer links doesn't have an inner text value.";
            if (this.innerTextExist(paragraph)) return wrong(errorMsg);

            return correct()
        }),
        // test #40 removed
        this.page.execute(() => {
            // test #41
            // COLUMN EXIST

            const contactDiv = document.body.querySelector("#contact");

            // COL EXIST

            // check if col div exist
            let errorMsg = "The new column div tag with the id of 'contact-col2' is missing inside the contact div tag.";
            if (this.notExist("#contact-col2", contactDiv, "div")) return wrong(errorMsg);

            // FORM EXIST

            // check if form exist
            errorMsg = "The form tag is missing inside the new column div tag.";
            if (this.notExist("form", "div")) return wrong(errorMsg);

            // check if h5 exist
            errorMsg = "The h5 tag is missing inside the form tag.";
            if (this.notExist("h5", "form")) return wrong(errorMsg);

            // CONTAINER DIV

            // check if div exist
            errorMsg = "The div tag wrapping the email input is missing inside the form tag.";
            if (this.notExist("h5 + div", "form")) return wrong(errorMsg);

            // check if label exist
            const wrapperDiv = contactDiv.querySelector("h5 + div");
            errorMsg = "The label tag for email input is missing inside the wrapper div tag.";
            if (this.notExist("label", wrapperDiv)) return wrong(errorMsg);

            // check if input exist
            errorMsg = "The input tag for email is missing inside the wrapper div tag.";
            if (this.notExist("label + #email", wrapperDiv)) return wrong(errorMsg);

            // CONTAINER DIV

            const form = contactDiv.querySelector("form");

            // check if div exist
            errorMsg = "The div tag wrapping the checkbox is missing inside the form tag.";
            if (this.notExist("div + div", form)) return wrong(errorMsg);

            // check if label exist
            const wrapperDiv2 = form.querySelector("div + div");

            errorMsg = "The label tag for checkbox is missing inside the wrapper div tag.";
            if (this.notExist("label", wrapperDiv2)) return wrong(errorMsg);

            // check if input exist
            errorMsg = "The checkbox is missing inside the label tag.";
            if (this.notExist("label > input", "label")) return wrong(errorMsg);

            // check if button exist
            errorMsg = "The button tag is missing inside the form tag.";
            if (this.notExist("button", "form")) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #42
            // COLUMN STYLE

            const col = document.body.querySelector("#contact-col2");

            // check if new column div has max-width style
            let errorMsg = "The contact col2 div tag doesn't have the correct max-width value.";
            if (this.correctStyle(col, "maxWidth", "100%")) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #43
            // h5 STYLE

            const col = document.body.querySelector("#contact-col2");
            const h5 = col.querySelector("h5");

            // check if h5 has inner text
            let errorMsg = "The h5 tag doesn't have an inner text value.";
            if (this.innerTextExist(h5)) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #44
            // label STYLE

            const col = document.body.querySelector("#contact-col2");
            const wrapper = col.querySelector("h5 + div");
            const label = wrapper.querySelector("label");

            // check if label has inner text
            let errorMsg = "The email label tag doesn't have the correct inner text value.";
            if (this.innerTextExist(label, "Email")) return wrong(errorMsg)

            // check if label has for attr
            errorMsg = "The email label tag doesn't have the correct for attribute value.";
            if (this.correctAttr(label, "for", "email")) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #45
            // input attr

            const input = document.body.querySelector("#email");

            // check if input has required attr
            let errorMsg = "The email input tag doesn't have the correct required attribute value.";
            if (!input["required"] || input["required"].toString() !== "true") return wrong(errorMsg)

            // check if input has type attr
            errorMsg = "The email input tag doesn't have the correct type attribute value.";
            if (this.correctAttr(input, "type", "email")) return wrong(errorMsg)

            // check if input has placeholder attr
            errorMsg = "The email input tag doesn't have a placeholder attribute value.";
            if (this.correctAttr(input, "placeholder")) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #46
            // label STYLE

            const col = document.body.querySelector("#contact-col2");
            const wrapper = col.querySelector("div + div");
            const label = wrapper.querySelector("label");

            // check if label has inner text
            let errorMsg = "The checkbox label tag doesn't have an inner text value.";
            if (this.innerTextExist(label)) return wrong(errorMsg);

            return correct()

        }), this.page.execute(() => {
            // test #47
            // input attr

            const col = document.body.querySelector("#contact-col2");
            const wrapper = col.querySelector("div + div");
            const input = wrapper.querySelector("input");

            // check if input has required attr
            let errorMsg = "The checkbox input tag doesn't have the correct required attribute value.";
            if (!input["required"] || input["required"].toString() !== "true") return wrong(errorMsg)

            // check if input has type attr
            errorMsg = "The checkbox input tag doesn't have the correct type attribute value.";
            if (this.correctAttr(input, "type", "checkbox")) return wrong(errorMsg)

            return correct()

        }), this.page.execute(() => {
            // test #48
            // button

            const col = document.body.querySelector("#contact-col2");
            const button = col.querySelector("button");

            // check if button inner text
            let errorMsg = "The button tag doesn't have an inner text value.";
            if (this.innerTextExist(button)) return wrong(errorMsg);

            // check if button has type attr
            errorMsg = "The button tag doesn't have the correct type attribute value.";
            if (this.correctAttr(button, "type", "submit")) return wrong(errorMsg)

            return correct()

        })]


}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);