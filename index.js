const core = require('@actions/core')
const github = require('@actions/github')
const { default: axios } = require('axios');
const fs = require('fs');

async function main(){
try {
    const kelas = core.getInput('kelas');
    console.log(`Kelas ${kelas}!`);
    const week = core.getInput('minggu-ke');
    console.log(`Minggu ke-${week}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    const {payload} = github.context
    console.log(payload)
    fs.readFile('test.log','utf-8', (err, data)=> {
      if(data){
        const gradeData = {
          user : {
            name : payload.head_commit.author.name,
            email : payload.head_commit.author.email,
            username : payload.head_commit.author.masaditya
          },
          assignment : {
            repo_url : payload.repository.html_url,
            repo_name : payload.repository.full_name.split("/")[1],
            week : week,
            class : kelas
          },
          grade : {
            correct : 0,
            incorrect : 0,
            detail : parseData(data)
          }
        }
        console.log(gradeData)
      }
      else
        console.log("data empty")
    })
    // sendData()
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()

function parseData (data=""){
  let arrString = data.split(/\s+/)
  let indexTestName = []
  let indexTestNameClose = []
  let testResult = []

 arrString.forEach((item, i) => {
    if(item == "✓" || item == "✕"){
      indexTestName.push(i)
    }
    if(item == "ms)"){
      indexTestNameClose.push(i+1)
      return item
    }
  })

  for (let i = 0; i < indexTestName.length; i++) {
    let testName = arrString.slice(indexTestName[i], indexTestNameClose[i]).join(" ")
    testResult.push(testName)
  }

  return testResult
}

async function sendData ( ){
  let data = await axios.get('https://5fb13d76590189001644662d.mockapi.io/api/tugas')
  console.log(data.data)
}

