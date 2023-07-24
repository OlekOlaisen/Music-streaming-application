import NotFoundImage from '../assets/images/notFoundImage.gif'

function NotFound() {
  return (
    <img className='notFound__image' src={NotFoundImage} alt="404 not found" />
  );
}

export default NotFound;
