
addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

class ElementHandler {
  state = null;
  constructor(state) {
    this.state = state;
  }

  element(element) {
    if (element.tagName === "title") element.setInnerContent(this.state.title)
    else if (element.tagName === "h1") element.setInnerContent(this.state.headingName);
    else if (element.tagName === 'p') element.setInnerContent(this.state.description);
    else if (element.tagName === 'a') {
      element.setInnerContent("Lets discover the Github Profile of Rishabh Sharma ");
      element.setAttribute('href', this.state.githubLink);
    }
  }
}
async function handleRequest(request) {


  const cookieName = 'idx';
  const fetchUrl = 'https://cfw-takehome.developers.workers.dev/api/variants';

  const cookie = request.headers.get('cookie')
  let idx;
  if (cookie && cookie.includes(`${cookieName}=1`)) idx = 1;
  else if (cookie && cookie.includes(`${cookieName}=2`)) idx = 2;
  else idx = getRandomIndex();


  let response ;


  try { response = await fetch(fetchUrl, { method: 'GET' }); }
  catch(e){ return new Response(e) }

  
  try{ response = await response.json();}
  catch(e){return new Response(e)}

  const url = response.variants[idx];
  
  let myHead = new Headers();
  myHead.append('Content-Type','text/plain; charset=UTF-8');
  myHead.append("Access-Control-Allow-Origin","*");
  try{ response = await fetch(url,myHead);}
  catch(e){return new Response(e)} 


  const constants = {
    title: "MyCustomizedTitle",
    headingName: `Welcome to variant ${idx + 1}`,
    description: `This is the customized description for variant ${idx + 1}`,
    githubLink: 'https://github.com/rish6696/'
  }

  let responseTosend = new HTMLRewriter()
    .on('title', new ElementHandler(constants))
    .on('#title', new ElementHandler(constants))
    .on('#description', new ElementHandler(constants))
    .on('a', new ElementHandler(constants))
    .transform(response);
  responseTosend = new Response(responseTosend.body, responseTosend);
  responseTosend.headers.append('Set-Cookie', `${cookieName}=${idx+1}; path=/`)
  return responseTosend;

}


function getRandomIndex() {
  let min = 0;
  let max = 2;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}





