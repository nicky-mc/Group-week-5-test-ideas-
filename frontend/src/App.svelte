<script>
    import { onMount } from 'svelte';
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let subjects = ['general', 'technology', 'sports'];
    let currentSubject = subjects[0];
    let posts = [];
    let newPostContent = '';

    async function fetchPosts() {
        const { data, error } = await supabase.from(currentSubject).select('*');
        if (error) {
            console.error(error);
        } else {
            posts = data;
        }
    }

    async function createPost() {
        if (!newPostContent) return;
        const { error } = await supabase.from(currentSubject).insert([{ content: newPostContent }]);
        if (error) {
            console.error(error);
        } else {
            fetchPosts();
            newPostContent = '';
        }
    }

    async function likePost(id) {
        const { error } = await supabase
            .from(currentSubject)
            .update({ likes: supabase.raw('likes + 1') })
            .eq('id', id);

        if (error) {
            console.error(error);
        } else {
            fetchPosts();
        }
    }

    async function deletePost(id) {
        const { error } = await supabase.from(currentSubject).delete().eq('id', id);
        if (error) {
            console.error(error);
        } else {
            fetchPosts();
        }
    }

    onMount(fetchPosts);
</script>

<main>
    <h1>Bulletin Board</h1>

    <div class="tabs">
        {#each subjects as subject}
            <button on:click={() => { currentSubject = subject; fetchPosts(); }}>
                {subject}
            </button>
        {/each}
    </div>

    <input placeholder="Write a new post..." bind:value={newPostContent} />
    <button on:click={createPost}>Add Post</button>

    <ul>
        {#each posts as post}
            <li>
                <p>{post.content} - {post.likes} likes</p>
                <div class="actions">
                    <button on:click={() => likePost(post.id)}>Like</button>
                    <button on:click={() => deletePost(post.id)}>Delete</button>
                </div>
            </li>
        {/each}
    </ul>
</main>

<style>
    /* Your styles here */
    main {
        max-width: 800px;
        margin: 40px auto;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
    }

    .tabs {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .tabs button {
        background-color: #eee;
        border: none;
        padding: 10px 20px;
        margin: 0 5px;
        cursor: pointer;
        transition: background-color 0.3s;
        border-radius: 4px;
    }

    .tabs button:hover {
        background-color: #ddd;
    }

    .tabs button:focus {
        outline: none;
        background-color: #ccc;
    }

    input {
        width: calc(100% - 120px);
        padding: 10px;
        margin-right: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    button {
        padding: 10px;
        border: none;
        background-color: #007BFF;
        color: white;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #0056b3;
    }

    button:focus {
        outline: none;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 20px 0;
    }

    li {
        background-color: #fafafa;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .actions {
        margin-left: 10px;
    }

    .actions button {
        margin-left: 5px;
    }
</style>