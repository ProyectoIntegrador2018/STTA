function toFileBlob(response) {
    const file = new Blob(
      [response.data],
      { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL);
  }

function setState(){
  return {
    data:[],
    data2:[],
    loading:true,
    record:{},
    cols:[]
  }
}
  
  export { toFileBlob,  setState};