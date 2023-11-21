import pages from './src/page.ts';
import {Data} from "./src/types.ts";

let data: Data = {
  items: []
}

for (let i = 0; i < pages.length; i += 1) {
  data = await pages[i].scrape(data)
}

console.log(data)