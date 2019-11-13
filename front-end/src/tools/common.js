function toFileBlob(response) {
    const file = new Blob(
      [response.data],
      { type: 'application/pdf' });
    //Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    //Open the URL on new Window
    window.open(fileURL);
  }
  
  export { toFileBlob };