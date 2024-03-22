const cl = console.log;

const addProduct = document.getElementById("addProduct");
const loader = document.getElementById("loader");
const prodContainer = document.getElementById("prodContainer");
const productStatusControl = document.getElementById("productStatus");
const prodForm = document.getElementById("prodForm");
const prodNameControl = document.getElementById("prodName");
const prodDescControl = document.getElementById("prodDesc");
const prodImgControl = document.getElementById("prodImg");
// const prodModal = document.getElementById("prodModal");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const baseUrl = `https://fetch-async-await-6ee8c-default-rtdb.asia-southeast1.firebasedatabase.app/`;

const postUrl = `${baseUrl}/posts.json`;

const hideLoader = () => {
    loader.classList.add("d-none");
}

const onDelete = async (ele) => {
    Swal.fire({
        title: "Do you want to remove this product?",
        text: "You won't be able to revert this!",
        icon: "warning",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true
      }).then( async (result) => {
        if (result.isConfirmed) {
            try {
                let deleteId = ele.closest(".card").id;
                let deleteUrl = `${baseUrl}/posts.json`;
                let res = await makeApiCall("DELETE", deleteUrl);
                ele.closest(".card".remove);
            } catch (err) {
                cl(err)
            }
            finally{
                hideLoader();
            }
          Swal.fire({
            title: "Your product has been deleted!",
            icon: "success",
            timer: 3000
          });
        }
    })
}

const onEdit = async(ele) => {
    let editId = ele.closest(".card").id;
    let editUrl = `${baseUrl}/posts/{editId}.json`;
    try {
        localStorage.setItem("editId", editId);
        let res = await makeApiCall("GET", editUrl);
        prodNameControl.value = res.prodName;
        prodDescControl.value = res.prodDesc;
        prodImgControl.value = res.prodImg;
        productStatusControl.value = res.productStatus;
        updateBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");
    } catch (err) {
        cl(err)
    }finally{
        hideLoader();
    }
}


const objToArr = (res) => {
    let postArr = [];
    for (const key in res) {
        let obj = {...res[key], id:key};
        postArr.push(obj);
    }
    return postArr;
}

const insertCard = (obj) => {
    let card = document.createElement("div");
    card.className = "card mb-4";
    card.id = obj.id;
    card.innerHTML = `
                                <div class="card-header">
                                    <h4 class="m-0 d-flex justify-content-between">
                                        ${obj.prodName}
                                    </h4>
                                    <span class="m-0">${obj.productStatus}</span>
                                </div>
                                <div class="card-body">
                                    <img src="${obj.prodImg}" alt="prodImg" title="prodImg">
                                    <p class="m-0">${obj.prodDesc}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <button class="btn btn-success">Add</button>
                                    <button class="btn btn-danger">Delete</button>
                                </div>
                                </div>
                     `;
                     prodContainer.append(card);
} 

const tempatingOfCard = (arr) => {
    arr.forEach(obj => {
        insertCard(obj);
    })
}

const makeApiCall = async (methodName, apiUrl, msgBody) => {
    try {
        let msgInfo = msgBody ? JSON.stringify(msgBody) : null;
        loader.classList.remove("d-none");
        let res = await fetch(apiUrl,{
            method: methodName,
            body: msgInfo
        })
        return res.json();
        } catch (err) {
            cl(err)
        }
        finally{
            hideLoader();
        }
    
    }
const fetchPosts = async () => {
    try {
        let res = await makeApiCall("GET", postUrl);
        cl(res);
        let postArr = objToArr(res);
        tempatingOfCard(postArr);
    } catch (err) {
        cl(err);
    }
    finally{
        loader.classList.add("d-none");
    }
}
fetchPosts();


const onProdSubmit = async (eve) => {
    eve.preventDefault();
    try{
    let newPost = {
        prodName : prodNameControl.value,
        prodDesc : prodDescControl.value,
        prodImg : prodImgControl.value,
        productStatus : productStatusControl.value
    }
    cl(newPost)
        let res = await makeApiCall("POST", postUrl, newPost);
        newPost.id = res.name;
        createProd(newPost);
        Swal.fire({
            title: "Product is submitted successfully!!!",
            icon: "success",
            timer : 2000
          });
    } catch (err) {
        cl(err)
    }finally{
        hideLoader();
        prodForm.reset();
    }
}


const onProdUpdate = async () => {
    let updatedObj = {
        prodName : prodNameControl.value,
        productStatus : productStatusControl.value,
        prodImg : prodImgControl.value,
        prodDesc : prodDescControl.value
    
    }
    cl(updatedObj);
    try {
        let updateId = localStorage.getItem("editId");
        localStorage.removeItem("editId");
        let updatedUrl = `${baseUrl}/posts/${updateId}.json`;
        let res = await makeApiCall("PATCH", updatedUrl, updatedObj);
        cl(res)
        updatedObj.id = updateId;
        let card = [...document.getElementById(updatedObj.id).children];

        card[0].innerHTML = `<h4 class="m-0">${updatedObj.title}</h4>`;
        card[1].innerHTML = `<p class="m-0">${updatedObj.title}</p>`;
        Swal.fire({
            title: "Product is updated successfully",
            icon: "success",
            timer: 3000
          });
    } catch (err) {
        cl(err)
    }finally{
        hideLoader();
        prodForm.reset();
        submitBtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }
}

prodForm.addEventListener("submit", onProdSubmit);
updateBtn.addEventListener("click", onProdUpdate);