import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';
import { faClipboardList, faAppleAlt, faDumbbell, faHeartbeat, faChartLine, faCog, faClock } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Carousel from 'react-bootstrap/Carousel'; // Import Carousel component from Bootstrap
import img1 from '../images/track2.jpg';
import img2 from '../images/eat healthy.png';
import img3 from '../images/stayfit.jpg';
import img4 from '../images/healthy.png';

export default function Home() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const redirectToSignup = () => {
    navigate('/signup');
  };

  return (
    <div>
      {/* Set overflow for the body */}
      <style>
        {`
          body {
            overflow-x: hidden; /* Prevent horizontal scroll */
          }
          h1, h2 {
            transition: all 0.3s ease-in-out;
          }
          h1:hover, h2:hover {
            text-shadow: 0 4px 10px rgba(0, 186, 255, 0.5);
            transform: scale(1.05);
          }
          .feature-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            padding: ${windowWidth < 768 ? '25px' : windowWidth < 1024 ? '30px' : '35px'};
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            text-align: center;
            min-height: ${windowWidth < 768 ? '280px' : '320px'};
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }
          .feature-card:hover {
            transform: scale(1.03);
            box-shadow: 0 10px 35px rgba(0, 191, 255, 0.6);
          }
          .feature-icon {
            transition: transform 0.3s ease-in-out;
          }
          .feature-icon:hover {
            transform: scale(1.1);
          }
        `}
      </style>

      {/* Navbar */}
      <Navbar />

      {/* Decorative background container */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1, pointerEvents: 'none', display: windowWidth < 768 ? 'none' : 'block' }}>
        {/* Circles on the left side */}
        <div style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)' }}>
          {/* First Circle (Left) */}
          <div style={{
            width: windowWidth < 1024 ? '450px' : '600px',
            height: windowWidth < 1024 ? '450px' : '600px',
            backgroundColor: '#87CEEB',
            borderRadius: '50%',
            position: 'absolute',
            left: windowWidth < 1024 ? '-225px' : '-300px',
            top: windowWidth < 1024 ? '-75px' : '-100px',
            opacity: '1',
          }} />
          {/* Second Circle (Left) */}
          <div style={{
            width: windowWidth < 1024 ? '550px' : '750px',
            height: windowWidth < 1024 ? '550px' : '750px',
            backgroundColor: '#87CEEB',
            borderRadius: '50%',
            position: 'absolute',
            left: windowWidth < 1024 ? '-275px' : '-375px',
            top: windowWidth < 1024 ? '-350px' : '-475px',
            opacity: '0.9',
          }} />
        </div>

        {/* Circles on the right side */}
        <div style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)' }}>
          {/* First Circle (Right) */}
          <div style={{
            width: windowWidth < 1024 ? '450px' : '600px',
            height: windowWidth < 1024 ? '450px' : '600px',
            backgroundColor: '#87CEEB',
            borderRadius: '50%',
            position: 'absolute',
            right: windowWidth < 1024 ? '-225px' : '-300px',
            top: windowWidth < 1024 ? '-75px' : '-100px',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
            opacity: '1',
          }} />
          {/* Second Circle (Right) */}
          <div style={{
            width: windowWidth < 1024 ? '550px' : '750px',
            height: windowWidth < 1024 ? '550px' : '750px',
            backgroundColor: '#87CEEB',
            borderRadius: '50%',
            position: 'absolute',
            right: windowWidth < 1024 ? '-275px' : '-375px',
            top: windowWidth < 1024 ? '-350px' : '-475px',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
            opacity: '0.9',
          }} />
        </div>
      </div>

      {/* Main Content with Carousel */}
      <div style={{
        display: 'flex',
        flexDirection: windowWidth < 768 ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: windowWidth < 768 ? 'center' : 'flex-start',
        minHeight: 'auto',
        padding: windowWidth < 768 ? '100px 20px 60px' : '120px 60px 80px',
        color: '#000',
        maxWidth: windowWidth < 1200 ? '100%' : '1400px',
        margin: '0 auto',
      }}>
        <div style={{
          flex: '1',
          textAlign: windowWidth < 768 ? 'center' : 'left',
          maxWidth: windowWidth < 768 ? '100%' : '600px',
          padding: windowWidth < 768 ? '0' : '0 20px'
        }}>
          <h1 style={{
            fontWeight: 'bold',
            fontSize: windowWidth < 768 ? '2.5rem' : windowWidth < 1024 ? '3.5rem' : '4.5rem',
            margin: '0 0 20px',
            color: '#000',
            lineHeight: '1.2'
          }}>
            Eat smarter.
          </h1>
          <h1 style={{
            fontWeight: 'bold',
            fontSize: windowWidth < 768 ? '2.5rem' : windowWidth < 1024 ? '3.5rem' : '4.5rem',
            margin: '0 0 30px',
            color: '#000',
            lineHeight: '1.2'
          }}>
            Live better.
          </h1>
          <p style={{
            fontSize: windowWidth < 768 ? '1.3rem' : windowWidth < 1024 ? '1.6rem' : '1.8rem',
            marginBottom: '50px',
            color: '#333',
            lineHeight: '1.5'
          }}>
            Track your diet, exercise, and health data.
          </p>

          {/* Sign Up Button */}
          <button
            onClick={redirectToSignup}
            style={{
              padding: windowWidth < 768 ? '18px 35px' : '20px 45px',
              fontSize: windowWidth < 768 ? '1.1rem' : '1.3rem',
              backgroundColor: '#00bfff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '30px',
              transition: 'all 0.3s',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0, 191, 255, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#008fbf';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 191, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#00bfff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 191, 255, 0.3)';
            }}
          >
            SIGN UP – It's Free
          </button>
        </div>

        {/* Centered and Enlarged Carousel */}
        <div style={{
          flex: '1',
          textAlign: 'center',
          marginLeft: windowWidth < 768 ? '0' : '40px',
          marginTop: windowWidth < 768 ? '40px' : '0',
          maxWidth: windowWidth < 768 ? '100%' : '550px',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <style>
            {`
              .carousel-container {
                max-width: 100%;
                margin: 0 auto;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 10px 60px rgba(0, 191, 255, 0.6);
                transition: transform 0.3s, box-shadow 0.3s;
              }

              .carousel-container:hover {
                transform: scale(1.03);
                box-shadow: 0 15px 80px rgba(0, 191, 255, 0.8);
              }

              .carousel-container img {
                border-radius: 0;
                transition: transform 0.3s;
                height: ${windowWidth < 768 ? '300px' : windowWidth < 1024 ? '350px' : '400px'};
              }
            `}
          </style>

          <div className="carousel-container" style={{ width: '100%' }}>
            <Carousel indicators={true} controls={false} interval={1000} className="custom-carousel">
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={img1}
                  alt="First slide"
                  style={{ objectFit: 'cover', height: windowWidth < 768 ? '300px' : windowWidth < 1024 ? '350px' : '400px', width: '100%' }}
                />
                <Carousel.Caption>
                  <h3 style={{ fontSize: windowWidth < 768 ? '1.2rem' : '1.4rem', fontWeight: 'bold' }}>Track Your Health</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={img2}
                  alt="Second slide"
                  style={{ objectFit: 'cover', height: windowWidth < 768 ? '300px' : windowWidth < 1024 ? '350px' : '400px', width: '100%' }}
                />
                <Carousel.Caption>
                  <h3 style={{ fontSize: windowWidth < 768 ? '1.2rem' : '1.4rem', fontWeight: 'bold' }}>Eat Healthy</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src={img3}
                  alt="Third slide"
                  style={{ objectFit: 'cover', height: windowWidth < 768 ? '300px' : windowWidth < 1024 ? '350px' : '400px', width: '100%' }}
                />
                <Carousel.Caption>
                  <h3 style={{ fontSize: windowWidth < 768 ? '1.2rem' : '1.4rem', fontWeight: 'bold' }}>Stay Fit</h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>

      {/* Grid Section for Health Features */}
      <div style={{
        padding: windowWidth < 768 ? '60px 20px' : windowWidth < 1024 ? '80px 40px' : '100px 60px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2.8rem' : '3.2rem',
          color: '#00bfff',
          marginBottom: windowWidth < 768 ? '40px' : '60px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>Develop healthy habits</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: windowWidth < 768 ? '1fr' : windowWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: windowWidth < 768 ? '25px' : windowWidth < 1024 ? '35px' : '45px',
        }}>
          {/* Feature 1 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faClipboardList} className="feature-icon" style={{
              color: '#00bfff',
              height: windowWidth < 768 ? '80px' : '100px',
              width: windowWidth < 768 ? '80px' : '100px',
              marginBottom: '20px'
            }} />
            <h3 style={{
              color: '#00bfff',
              fontSize: windowWidth < 768 ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>Track up to 84 nutrients</h3>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              Log your meals and track all your macro and micronutrients.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div style={{ marginBottom: '20px' }}>
              <FontAwesomeIcon icon={faAppleAlt} className="feature-icon" style={{
                color: '#00bfff',
                height: windowWidth < 768 ? '55px' : '65px',
                marginRight: '10px'
              }} />
              <FontAwesomeIcon icon={faDumbbell} className="feature-icon" style={{
                color: '#00bfff',
                height: windowWidth < 768 ? '55px' : '65px',
                marginRight: '10px'
              }} />
              <FontAwesomeIcon icon={faHeartbeat} className="feature-icon" style={{
                color: '#00bfff',
                height: windowWidth < 768 ? '55px' : '65px'
              }} />
            </div>
            <h3 style={{
              color: '#00bfff',
              fontSize: windowWidth < 768 ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>Log meals, exercise and health data</h3>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              Track your food, exercise, blood pressure, blood sugar, and cholesterol.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" style={{
              color: '#00bfff',
              height: windowWidth < 768 ? '80px' : '100px',
              width: windowWidth < 768 ? '80px' : '100px',
              marginBottom: '20px'
            }} />
            <h3 style={{
              color: '#00bfff',
              fontSize: windowWidth < 768 ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>Create custom reports</h3>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              Analyze your nutrition and health trends with our advanced reports.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faCog} className="feature-icon" style={{
              color: '#00bfff',
              height: windowWidth < 768 ? '80px' : '100px',
              width: windowWidth < 768 ? '80px' : '100px',
              marginBottom: '20px'
            }} />
            <h3 style={{
              color: '#00bfff',
              fontSize: windowWidth < 768 ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>Customize your experience</h3>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              Set your goals and track your progress.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faClock} className="feature-icon" style={{
              color: '#00bfff',
              height: windowWidth < 768 ? '80px' : '100px',
              width: windowWidth < 768 ? '80px' : '100px',
              marginBottom: '20px'
            }} />
            <h3 style={{
              color: '#00bfff',
              fontSize: windowWidth < 768 ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>Daily reminders</h3>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              Get daily reminders to stay on track.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <FontAwesomeIcon icon={faSeedling} className="feature-icon" style={{
              color: '#00bfff',
              height: windowWidth < 768 ? '80px' : '100px',
              width: windowWidth < 768 ? '80px' : '100px',
              marginBottom: '20px'
            }} />
            <h3 style={{
              color: '#00bfff',
              fontSize: windowWidth < 768 ? '1.3rem' : '1.5rem',
              marginBottom: '15px'
            }}>Nutrient suggestions</h3>
            <p style={{ fontSize: windowWidth < 768 ? '1rem' : '1.1rem', lineHeight: '1.6' }}>
              Receive personalized suggestions for your diet.
            </p>
          </div>
        </div>
      </div>
        <div style={{
          textAlign: 'center',
          padding: windowWidth < 768 ? '60px 20px 40px' : windowWidth < 1024 ? '80px 40px 40px' : '100px 60px 40px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: windowWidth < 768 ? '2rem' : windowWidth < 1024 ? '2.8rem' : '3.2rem',
            color: '#00bfff',
            marginBottom: '25px',
            fontWeight: 'bold'
          }}>Discover your nutrition</h2>
          <p style={{
            fontSize: windowWidth < 768 ? '1.2rem' : windowWidth < 1024 ? '1.5rem' : '1.7rem',
            color: '#333',
            maxWidth: '900px',
            margin: '0 auto',
            lineHeight: '1.7',
            marginBottom: windowWidth < 768 ? '50px' : '70px'
          }}>
            Protein Pro encourages you to not just count your calories but to focus on your nutrition as a whole.
          </p>
        </div>

        {/* New section for checkmarks and image */}
        <div style={{
          display: 'flex',
          flexDirection: windowWidth < 768 ? 'column-reverse' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: windowWidth < 768 ? 'auto' : '80vh',
          padding: windowWidth < 768 ? '40px 20px' : windowWidth < 1024 ? '60px 40px' : '80px 60px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: windowWidth < 768 ? '50px' : '0',
          }}>
            <div style={{
              width: windowWidth < 768 ? '300px' : windowWidth < 1024 ? '400px' : '550px',
              height: windowWidth < 768 ? '420px' : windowWidth < 1024 ? '520px' : '650px',
              overflow: 'hidden',
              borderRadius: '200px 200px 0 0',
              boxShadow: '0 10px 60px rgba(0, 191, 255, 0.7)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 15px 80px rgba(0, 191, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 60px rgba(0, 191, 255, 0.7)';
            }}
            >
              <img
                src={img4}
                alt="Nutrition visualization"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '200px 200px 0 0',
                }}
              />
            </div>
          </div>

          {/* Right Side Checkmarks */}
          <div style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: windowWidth < 768 ? 'center' : 'flex-start',
            padding: windowWidth < 768 ? '0' : '0 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: windowWidth < 768 ? 'flex-start' : 'center',
              marginBottom: windowWidth < 768 ? '40px' : '60px',
              flexDirection: windowWidth < 768 ? 'column' : 'row',
              textAlign: windowWidth < 768 ? 'center' : 'left'
            }}>
              <div style={{
                width: windowWidth < 768 ? '70px' : '75px',
                height: windowWidth < 768 ? '70px' : '75px',
                backgroundColor: 'skyblue',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: windowWidth < 768 ? '0' : '20px',
                marginBottom: windowWidth < 768 ? '15px' : '0',
                flexShrink: 0
              }}>
                <FontAwesomeIcon icon={faCheck} style={{
                  color: 'white',
                  fontSize: windowWidth < 768 ? '1.8rem' : '2rem'
                }} />
              </div>
              <div>
                <h4 style={{
                  color: '#00bfff',
                  margin: '0 0 10px 0',
                  fontSize: windowWidth < 768 ? '1.4rem' : '1.6rem'
                }}>Accurate nutrition data</h4>
                <p style={{
                  fontSize: windowWidth < 768 ? '1.1rem' : '1.2rem',
                  color: '#333',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  Be confident that the food you log has the correct nutrition data. We verify every food submission for accuracy.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: windowWidth < 768 ? 'flex-start' : 'center',
              marginBottom: windowWidth < 768 ? '40px' : '60px',
              flexDirection: windowWidth < 768 ? 'column' : 'row',
              textAlign: windowWidth < 768 ? 'center' : 'left'
            }}>
              <div style={{
                width: windowWidth < 768 ? '70px' : '75px',
                height: windowWidth < 768 ? '70px' : '75px',
                backgroundColor: 'skyblue',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: windowWidth < 768 ? '0' : '20px',
                marginBottom: windowWidth < 768 ? '15px' : '0',
                flexShrink: 0
              }}>
                <FontAwesomeIcon icon={faCheck} style={{
                  color: 'white',
                  fontSize: windowWidth < 768 ? '1.8rem' : '2rem'
                }} />
              </div>
              <div>
                <h4 style={{
                  color: '#00bfff',
                  margin: '0 0 10px 0',
                  fontSize: windowWidth < 768 ? '1.4rem' : '1.6rem'
                }}>Data privacy & security</h4>
                <p style={{
                  fontSize: windowWidth < 768 ? '1.1rem' : '1.2rem',
                  color: '#333',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  We don't sell your account data to third parties and take the security of our users' accounts seriously.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: windowWidth < 768 ? 'flex-start' : 'center',
              marginBottom: windowWidth < 768 ? '20px' : '0',
              flexDirection: windowWidth < 768 ? 'column' : 'row',
              textAlign: windowWidth < 768 ? 'center' : 'left'
            }}>
              <div style={{
                width: windowWidth < 768 ? '70px' : '75px',
                height: windowWidth < 768 ? '70px' : '75px',
                backgroundColor: 'skyblue',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: windowWidth < 768 ? '0' : '20px',
                marginBottom: windowWidth < 768 ? '15px' : '0',
                flexShrink: 0
              }}>
                <FontAwesomeIcon icon={faCheck} style={{
                  color: 'white',
                  fontSize: windowWidth < 768 ? '1.8rem' : '2rem'
                }} />
              </div>
              <div>
                <h4 style={{
                  color: '#00bfff',
                  margin: '0 0 10px 0',
                  fontSize: windowWidth < 768 ? '1.4rem' : '1.6rem'
                }}>User-friendly interface</h4>
                <p style={{
                  fontSize: windowWidth < 768 ? '1.1rem' : '1.2rem',
                  color: '#333',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  Our intuitive design makes it easy to track your nutrition and reach your goals with minimal effort.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
