import React from "react";

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-4xl text-center mb-6">About Us</h1>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to <span className="font-semibold text-primary">DIY Inspiration</span>, your go-to platform for all things home DIY. Whether you're looking to transform your space, create stunning decor, or find new projects to get your hands on, we've got you covered.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Inspired by platforms like Pinterest, our application is designed to bring DIY enthusiasts together to share ideas, showcase completed projects, and explore a world of creativity. 
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Here, you can:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Discover DIY projects for every room and style.</li>
            <li>Share your own completed projects and inspire others.</li>
            <li>Connect with like-minded creators and collaborate on ideas.</li>
            <li>Access detailed guides and shopping lists to help you get started.</li>
          </ul>
          <p className="text-lg text-gray-600">
            Our mission is to build a supportive and inspiring community for creators of all skill levels. Join us in celebrating the art of making and find your next big DIY idea today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;