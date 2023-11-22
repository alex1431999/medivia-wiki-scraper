import pages from './src/page.ts';
import {Data} from "./src/types.ts";
import * as fs from "fs";

let data: Data = {
  items: [],
  creatures: []
}

for (let i = 0; i < pages.length; i += 1) {
  data = await pages[i].scrape(data)
}

fs.writeFileSync('./output/data.json', JSON.stringify(data, null, 2))