
let posts = [
    {
        id: 1,
        title: "lalala",
        content: "content",
        author: "ya",
        category: "horror"
    },
    {
        id: 2,
        title: "lalala2",
        content: "content2",
        author: "ya2",
        category: "horror2"
    },
    {
        id: 3,
        title: "lalala3",
        content: "content3",
        author: "ya3",
        category: "horror3"
    },
    {
        id: 4,
        title: "lalala3",
        content: "content3",
        author: "ya3",
        category: "horror"
    },
]
async function addPostProm(post, fail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (fail === "true") {
                reject(new Error("Failed to save post"))
                return
            }
            posts = [...posts, post]
            resolve(posts)
        }, 500)
    })
}

export function getAll(take, category){

    if(!take){
        return [...posts]
    }
    if (category){
        const filteredPosts = posts.filter(post => post.category === category)
        return filteredPosts.slice(0, take)
    }
    return posts.slice(0, take)
    }

export function getById(id){
    const isFind = posts.find((post) => {
        return post.id === id
        
    })
    return isFind
}

export async function addPost(post, fail){
    return await addPostProm(post, fail)
}
