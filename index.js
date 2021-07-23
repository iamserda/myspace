const blogDisplayArea = document.getElementById("blogList")
const submitButton = document.getElementById("submit");
let start = 0;
//makes more sense as an anchor, instead of a button!
const fetchButton = document.getElementById("fetchAPI");

function formatter(data) {
    const textTitle = document.createElement("h3");
    const textBody = document.createElement("p");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add('message');
    textBody.classList.add('text-body');
    textTitle.classList.add('text-title');
    textTitle.textContent = data.title;
    textBody.textContent = data.body;
    messageDiv.appendChild(textTitle);
    messageDiv.appendChild(textBody);

    return messageDiv;
}

//handles form data submission;
submitButton.addEventListener('click', (evt) => {
    // temporarily prevent default
    evt.preventDefault();
    const textTitle = document.getElementById("text-title").value;
    const textBody = document.getElementById("text-body").value;

    if (!textTitle || !textBody) {
        console.error("missing title or message.")
        return;
    }

    const postBody = {
        title: textTitle,
        body: textBody
    };
    const message = formatter(postBody);

    fetch("https://jsonplaceholder.typicode.com/posts/", {
            method: 'POST',
            body: JSON.stringify({
                ...postBody,
                userId: 20
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((response) => response.json())
        .then((data) => {
            const message = formatter(data);
            blogDisplayArea.prepend(message);
        });

})

fetchButton.addEventListener('click', (evt) => {
    // temporarily prevent default
    evt.preventDefault();
    if (fetchButton.innerText.toLocaleLowerCase() === "clear") clearBlogList();
    else {
        document.getElementById("blogList").innerHTML = null;
        fetch("https://jsonplaceholder.typicode.com/posts/")
            .then(response => response.json())
            .then(data => {
                const end = start + 5;
                data.slice(start, end).forEach(
                    (item) => {
                        console.log(start, end)
                        const message = formatter(item);
                        blogDisplayArea.prepend(message);
                    })
                updateFetchButton(data.length);
            })
            .catch(err => console.error(`error: ${err}`))
    }

})

// updates the fetchButton: "Fetch!", "Next", "Clear"
async function updateFetchButton(len) {
    const length = await len;
    if (length === 0) {
        document.getElementById("fetchAPI").textContent = "Fetch!";
        return;
    }

    if (start < 0 || start === null) {
        console.error("Start value is less than 0 or null!")
    } else if (start <= length - 6) {
        start += 5;
        document.getElementById("fetchAPI").textContent = "Next";
    } else {
        document.getElementById("fetchAPI").textContent = "Clear";
    }
}

function clearBlogList() {
    //clear the div containing all the blog post.
    document.getElementById("blogList").innerHTML = null;
    // reset start
    start = 0;
    //reset button
    updateFetchButton(0);
}

function clearInputBox() {
    document.getElementById('text-body').value = "";
    document.getElementById('text-title').value = "";
}