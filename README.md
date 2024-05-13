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
 ![image](https://github.com/hyeonbinHur/DDock-DDock/assets/160996936/5559af68-3a2e-469f-8c9d-801b1099ebd2)

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

![alt text](image.png)

-   ### Market, Job, House, Community

    The pages related to the item include the all items page, detail page, add page, and edit page.

    |     Title      |          Images           |
    | :------------: | :-----------------------: |
    |   Home page    | ![alt text](image-1.png)  |
    | All items page | ![alt text](image-2.png)  |
    |  Detail page   | ![alt text](image-3.png)  |
    |    Add page    | ![alt text](image-5.png)  |
    |   Edit page    | ![alt text](image-11.png) |

-   ### Profile

    From both my profile page and other user's profile pages, you can find the corresponding user's item. Additionally, clicking on an item card will direct the user to that specific item. Moreover, on my profile page, you can also find interested item.

    |       Title        |          Images           |
    | :----------------: | :-----------------------: |
    |     My profile     | ![alt text](image-7.png)  |
    | Other user profile | ![alt text](image-8.png)  |
    |     Item card      | ![alt text](image-12.png) |

-   ### Sign in, Sign Up

    This project supports three methods of sign-up and sign-in: email authentication, Google authentication, and Facebook authentication.

    |  Title  |          Images           |
    | :-----: | :-----------------------: |
    | Sign in | ![alt text](image-9.png)  |
    | Sign up | ![alt text](image-10.png) |

-   ### Error page

    If any errors are found, the program directs the user to the error page. The user can move to other pages using the navigation bar or by pressing the logo on the error page.

    |   Title    |          Images          |
    | :--------: | :----------------------: |
    | Error page | ![alt text](image-6.png) |

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
