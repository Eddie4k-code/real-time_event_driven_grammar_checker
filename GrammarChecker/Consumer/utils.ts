import { MyProducer } from "../Producer/producer";
import { checkGrammar } from "../api";




//Function will check the grammar for text read by a consumer

export const onUploadTextConsume = async (consumerData: any) => {

    const checkedGrammarProducer = new MyProducer();

    console.log("Recieved Grammar Checked");
    console.log(consumerData)

    
      //Make api request to check grammar
      const data = await checkGrammar(consumerData.text);
            

      //produced checked grammar result back to user input service
      await checkedGrammarProducer.produce(JSON.stringify({result: data.matches, sessionId: consumerData.sessionId}));

}