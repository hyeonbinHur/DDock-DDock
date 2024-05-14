<a name="readme-top"></a>

## Pocket

<p>

<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white">
<img src="https://img.shields.io/badge/googlemaps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white">
<img src="https://img.shields.io/badge/react--router--dom-6.22.3-CA4245?style=for-the-badge&logo=react-router&logoColor=CA4245">
<img src="https://img.shields.io/badge/Hot--toast-2.4.1-A61E69?style=for-the-badge&logo=hot-toast&logoColor=A61E69">
<img src="https://img.shields.io/badge/redux--toolkit-2.2.3-764ABC?style=for-the-badge&logo=redux&logoColor=764ABC">
<img src="https://img.shields.io/badge/firebase-8.5-FFCA28?style=for-the-badge&logo=firebase&logoColor=FFCA28">
<img src="https://img.shields.io/badge/tailwind--css-3.4.3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=06B6D4">
<img src="https://img.shields.io/badge/uuid-9.0.1-FF7800?style=for-the-badge&logo=uuid&logoColor=white">
<img src="https://img.shields.io/badge/framer--motion-11.1.9-%230055FF.svg?style=for-the-badge&logo=framer&logoColor=0055FF">

</p>

<!-- PROJECT LOGO -->
<br />
<div align="center">
 <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/2c861161-9f90-4ce4-9f60-97095eb6c147" width="350">
 

  <p align="center">
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li>
      <a href="#pages">Pages</a>
    </li>
     <li>
      <details>
        <summary><a href="#usage">Data Structure</a></summary>
         <ul>
        <li>Collection</li>
        <li>Chatting Room</li>
        <li>CommunityItem</li>
        <li>HouseItem</li>
        <li>JobItem</li>
        <li>MarketItem</li>
        <li>User</li>
      </ul>
      </details>
    </li>
    <li>
      <details>
        <summary><a href="#usage">Features</a></summary>
        <ul>
          <li> 
            <details>
            <summary>Market, Job, House, Community</summary>
              <ul>
                <li>Read Items</li>
                <li>Read Item</li>
                <li>Post Item</li>
                <li>Delete Item</li>
                <li>Update Item</li>
              </ul>
            </details>
          </li>
          <li>
            <details> 
              <summary>Chatting</summary>
              <ul>
                <li>Send message</li>
                <li>send images</li>
                <li>read message</li>
                <li>unread message</li>
                <li>send notification</li>
              </ul>
            </details>
          </li>
          <li>
           <details> 
              <summary>Auth</summary>
              <ul>
                <li>Email Auth</li>
                <li>Google Auth</li>
                <li>FaceBook Auth</li>
              </ul>
            </details>
          </li>
        </ul>
      </details>
    </li>
    <li><a href="#roadmap">Reflecting on the Project</a></li>
  </ol>
</details>

---

## **About The Project**

The idea for this project originated from my experience in Melbourne. Living there as a student, I was able to meet a lot of international students and foreigners. They typically live in rental houses or share houses, necessitating frequent relocations. Additionally, Australia ranks among the top five most expensive countries globally, attracting many people to work from abroad. Most of these individuals seek various experiences, so they move often. Each move requires them to buy new furniture, which poses a significant financial burden for those trying to save money. I noticed that due to high living costs and frequent moves, many people often discard a lot of items and buy new ones. As a result, many people either avoid buying new items or inquire among acquaintances for used goods. Moreover, in such environments where many young people gather, I frequently encountered the need for communities to make friends. However, Australia still lacks representative communities that provide meeting opportunities for both foreigners and locals. Based on these observations, I found the potential of used goods and forming communities.

<p align="right">(<a href="#pocket">back to top</a>)</p>

## **Getting started**

This section explains how to run this project. Since the project is implemented using React Vite, several commands are required.

-   `npm install` -> download node module
-   `npm run dev` -> run react vite project
-   open ` Local:   http://localhost:5173/`

<p align="right">(<a href="#pocket">back to top</a>)</p>

## Pages

### 1. pages

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/1263a0b3-e2d3-42d4-8d8b-078506d7ca63">

-   ### Market, Job, House, Community

    The pages related to the item include the all items page, detail page, add page, and edit page.

    |     Title      |          Images           |
    | :------------: | :-----------------------: |
    |   Home page    | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/28c2c30c-c8f0-4094-b8ba-4cd4ad835493"> |
    | All items page | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/77332be5-1287-4657-ab4f-18bc88d2a5da"> |
    |  Detail page   | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/c7bfc978-5154-4810-8a15-8887fd1f31f9"> |
    |    Add page    | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/2d0d7041-0c18-4e0e-9f25-2d6056f6dafe">  |
    |   Edit page    | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/2f0e6d1a-ccd7-4496-ae59-d3c118ee3a66"> |

-   ### Profile

    From both my profile page and other user's profile pages, you can find the corresponding user's item. Additionally, clicking on an item card will direct the user to that specific item. Moreover, on my profile page, you can also find interested item.

    |       Title        |          Images           |
    | :----------------: | :-----------------------: |
    |     My profile     | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/7aef21ea-5bc1-45ac-b0d8-8fefd71ea020"> |
    | Other user profile | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/d1db2251-d059-4256-b222-5e32327b2183">  |
    |     Item card      | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/231f7e5b-4088-4994-b533-ebbc566b7015"> |

-   ### Sign in, Sign Up

    This project supports three methods of sign-up and sign-in: email authentication, Google authentication, and Facebook authentication.

    |  Title  |          Images           |
    | :-----: | :-----------------------: |
    | Sign in | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/8fa00d59-5864-423f-bf01-91967f5e5e64">  |
    | Sign up | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/10ad9ebc-ffe4-4cc6-b589-65070057b69f"> |

-   ### Error page

    If any errors are found, the program directs the user to the error page. The user can move to other pages using the navigation bar or by pressing the logo on the error page.

    |   Title    |          Images          |
    | :--------: | :----------------------: |
    | Error page | <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/afe06fe6-360d-475d-9585-43c5c8fb06db">|

    <br>
    <br>

### 2. Router Configuration

-   <a href="https://uncle-hyeonb.tistory.com/12"> My blog post about router </a>
    <br>
    <br>

    <img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/c510fd8b-36c6-4ea7-a672-e1ff32551f84">

<p align="right">(<a href="#pocket">back to top</a>)</p>

## Data Structure

### Collection
<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/44d6d619-3704-4228-9771-e1705c14005d">

### Data structure
<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/3752fdbe-a9ce-4cf4-964b-4128279593f8">

### Items

### User

### Chatting Room

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

### Items

1. add Item

To create an item, the user needs to be authenticated and access the add item page. When the user accesses the item page, they can add detailed information about the item, including images, title, description, price, etc. When the user creates an item, the images of the item are first stored in Firebase storage. Then, a function returns the URL for the images, and both the detailed information and image URL are stored in the Firestore database.
<br>
<br>

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/d8daa895-7f66-4ea9-ab99-23dfa033d06e">

> Once the user fills out the form and presses **Save**, they will see a confirmation modal to confirm the item. If the user presses **Edit**, they can return to the add item page. Once the user presses **Confirm**, they will see a spinner until the item is added. When the item is successfully added, the page will move to the corresponding item section and lead the user to view the added item.
> <br> > <br>

2. read Item

2.1 read collection

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/1de4df62-8d7a-4b76-82e9-0addb6c0e3ef">

Once users access the website, user can view all items. By using the search bar and location selector, user can find specific items that are in the selected location and include text in the search text box in title and description.

2.2 read document

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/e326cd43-7768-443f-a435-ec9f63bf2c5b">

If user press a certain item in the item list, user can check the detailed information of the item. The url link includes the item's id, and the program leads user to the deatiled information about the item.

> **useParams()**, and **dynamic path** are used to read a certain data. Moreover, to render the item detail page, <Link> and **static path** are used.

2.2.1 check other user's profile & start chatting

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/d0029e14-b715-4775-853d-3df97e6c7cf7">

Once the user accesses the item detail page, user will be able see the author's information. When another user's avatar is pressed, a popup division appears, which includes a profile and a chatting button to either move to the user's profile page or start a chat.

3. edit Item

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/3161edb6-35aa-4a87-9024-045f27f6b722">

Only the author is able to see the edit button in the item detail page. Once the author presses the edit button, author can move to the edit page, which includes all detailed information regarding the item. If the user edits the item, they can change the item's detailed information.

> To edit an item, the item URL must be changed. Editing the item page requires multiple steps. There are several ways to edit the image URL; I chose to delete the old image and add a new one to prevent the storage from becoming too large. Firstly, check whether the images are already stored; if an image is not stored in the storage, it will be uploaded. Moreover, if the images in the storage are no longer used, they will be deleted. Once all progress regarding the storage is complete, a function returns all image URLs in storage, changes the image URL, and updates it. Titles, descriptions, and prices can also be edited.

4. delete Item

Only the item's author is able to see the delete button in the item detail page. Once the author presses the delete button user can delete the item.

<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/efe7560b-4e51-4331-8fff-d2c28ed02d6f">

> Once user press the delete button, the item's images in the storage will be deleted first, and if all images of the item are deleted, the item will be deleted from the firestore as well.

### Chatting

1. create chatting room
2. send message
<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/2ee94e91-4ac3-437f-8473-8fb3570a3e4e">

3. send image
<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/96ae6620-c4db-4dda-9c17-29a93f10f5b0">

4. read message
<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/6d2f256b-dbd9-4c93-9f92-d12fde05c76d">

5. receive message
<img src="https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/9b5deeb5-7601-4cd6-9c6f-af34d82de525">


### Auth

1. Email authentication
2. Google authentication
3. Facebook authentiation

### Set Location

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Redux

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Reflecting on the Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>
