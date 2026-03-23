import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotLoggedProfile.module.css";

const NotLoggedProfile = () => {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>
            Discover images
            <br />
            that inspire you.
          </h1>
          <p>
            Save, share and organize everything you love — all in one place.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/register" className={styles.btnPrimary}>
              Get started — it's free
            </Link>
            <Link to="/login" className={styles.btnOutline}>
              Log in
            </Link>
          </div>
        </div>
        <div className={styles.heroImages}>
          <div className={`${styles.heroImg} ${styles.img0}`}>
            <img
              src="https://images.unsplash.com/photo-1673905890851-099627118e95?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className={`${styles.heroImg} ${styles.img1}`}>
            <img
              src="https://images.unsplash.com/photo-1558325865-a90aeca7fa8c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className={`${styles.heroImg} ${styles.img2}`}>
            <img
              src="https://images.unsplash.com/photo-1587115924362-622c3fa065bd?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className={`${styles.heroImg} ${styles.img3}`}>
            <img
              src="https://images.unsplash.com/photo-1568733873715-f9d497a47ea0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className={`${styles.heroImg} ${styles.img4}`}>
            <img
              src="https://images.unsplash.com/photo-1451342695181-17c97b85aab4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className={`${styles.heroImg} ${styles.img5}`}>
            <img
              src="https://images.unsplash.com/photo-1460551882935-745bdcaf8009?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
        </div>
      </section>

      <section className={styles.feature} style={{ background: "#f0f0f0" }}>
        <div className={styles.featureImages}>
          <div className={styles.folderPreview}>
            <div className={styles.folderGrid}>
              <img
                src="https://images.unsplash.com/photo-1569412148958-600837f89a65?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              <img
                src="https://images.unsplash.com/photo-1676676709542-2b08641ddf84?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              <img
                src="https://images.unsplash.com/photo-1675542905746-43047209149a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              <img
                src="https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <p className={styles.folderLabel}>My inspiration board</p>
          </div>
        </div>
        <div className={styles.featureText}>
          <h2>Save everything you love</h2>
          <p>
            Organize your favorite posts into folders. Keep your ideas close and
            share them with others.
          </p>
          <Link to="/register" className={styles.btnPrimary}>
            Start saving
          </Link>
        </div>
      </section>

      <section className={`${styles.feature} ${styles.featureReverse}`}>
        {" "}
        <div className={styles.featureImages}>
          <div className={styles.colorFilterPreview}>
            <div className={styles.colorGrid}>
              {[
                "#e63946",
                "#f4845f",
                "#f7b731",
                "#2ecc71",
                "#1abc9c",
                "#3498db",
                "#9b59b6",
                "#e91e8c",
                "#ffffff",
                "#b0b0b0",
                "#555555",
                "#1a1a1a",
              ].map((c) => (
                <div
                  key={c}
                  className={styles.colorDot}
                  style={{
                    background: c,
                    border: c === "#ffffff" ? "1px solid #ddd" : "none",
                  }}
                />
              ))}
            </div>
            <div className={styles.colorPreviewBar} />
            <p className={styles.colorPreviewLabel}>Filter by color</p>
          </div>
        </div>
        <div className={styles.featureText}>
          <h2>Filter by color</h2>
          <p>
            Looking for something specific? Filter all posts by color and find
            exactly the aesthetic you're after.
          </p>
          <Link to="/register" className={styles.btnPrimary}>
            Try it out
          </Link>
        </div>
      </section>

      <section className={`${styles.feature}`}>
        <div className={styles.featureImages}>
          <div className={styles.stackImages}>
            <div className={styles.stackImgBack}>
              <img
                src="https://images.unsplash.com/photo-1617011495598-b466ddf92812?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className={styles.stackImgFront}>
              <img
                src="https://images.unsplash.com/photo-1485921040253-3601b55d50aa?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className={styles.featureText}>
          <h2>Share your visual world</h2>
          <p>
            Build a profile that shows who you are through the images you love.
            Post, like, and comment.
          </p>
          <Link to="/register" className={styles.btnPrimary}>
            Create profile
          </Link>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to get inspired?</h2>
        <Link to="/register" className={styles.btnWhite}>
          Join Chroma for free
        </Link>
        <p>
          Already have an account?{" "}
          <Link to="/login" className={styles.ctaLink}>
            Log in
          </Link>
        </p>
      </section>
    </div>
  );
};

export default NotLoggedProfile;
