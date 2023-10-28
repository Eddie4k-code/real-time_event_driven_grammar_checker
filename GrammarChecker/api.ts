/* Setup axios to make request to grammar api */
/* https://rapidapi.com/grammarbot/api/grammarbot */

import { URLSearchParams } from "url"
import axios, {AxiosResponse} from 'axios';
import 'dotenv/config';


export const checkGrammar = async (text: string): Promise<any> => {

    const params = new URLSearchParams();
    params.set('text', text);
    params.set('language', 'en-US');

    const options = {
        method: 'POST',
        url: 'https://grammarbot.p.rapidapi.com/check',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': process.env.API_SECRET,
          'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com'
        },
        data: params,
      };


      try {

        const res = await axios.request(options);
        return res.data;

      } catch(err) {

        console.log(err);

      }

}