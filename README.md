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

    ![alt text](code.png)

<p align="right">(<a href="#pocket">back to top</a>)</p>

## Data Structure

### Collection

### Items

### User

### Chatting Room

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

### Items

### Chatting

### Auth

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Reflecting on the Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>
