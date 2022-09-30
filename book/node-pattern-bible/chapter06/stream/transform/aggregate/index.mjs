import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { FilterByContry } from './filter-by-country.mjs';
import { SumProfit } from './sum-profit.mjs';

const csvParser = parse({ columns: true });

createReadStream('./data.csv') //1
  .pipe(csvParser) //2
  .pipe(new FilterByContry('Kuwait')) //3
  .pipe(new SumProfit()) //4
  .pipe(process.stdout); //5
