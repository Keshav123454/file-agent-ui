import FileUploader from "../components/FileUploader";
import ChatBox from "../components/chatBox";

const Home = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Assistant</h1>

      <FileUploader />
      <ChatBox />
    </div>
  );
};

export default Home;