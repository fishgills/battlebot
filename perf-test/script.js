import http from 'k6/http';
import { sleep } from 'k6';

let accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJvdCIsInN1YiI6IjBlMjZiODYzLTRlYzQtNGMyOC04MDhmLTVkOGVlMzYyYTc5ZCIsImlhdCI6MTY0NzI0NzAyMSwiZXhwIjoxNjQ3MjQ4ODIxfQ.Qwy-VIiNMk8_2ACdiQYTpgNFXD0d5a0QVVwLod52wbA';

export default function () {
  let query = `
    query FindByOwner {
  findByOwner(owner: "U01CJ3YFV6W", teamId: "T01CJA1PZHR") {
    id
    attacking {
      id
    }
  }
}`;

  let headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let res = http.post(
    'https://api.slackbattlebot.com/graphql',
    JSON.stringify({ query: query }),
    { headers: headers },
  );

  if (res.status === 200) {
    console.log(JSON.stringify(res.body));
    let body = JSON.parse(res.body);
    let issue = body.data.repository.issues.edges[0].node;
    console.log(issue.id, issue.number, issue.title);

    let mutation = `
      mutation AddReactionToIssue {
        addReaction(input:{subjectId:"${issue.id}",content:HOORAY}) {
          reaction {
            content
          }
          subject {
            id
          }
        }
    }`;

    res = http.post(
      'https://api.slackbattlebot.com/graphql',
      JSON.stringify({ query: mutation }),
      { headers: headers },
    );
  }
  sleep(0.3);
}
