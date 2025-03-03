import { useEffect } from "react";
import { db } from "./schema";
import { useWrite } from "../useWrite";

// Example React component
function UserProfileComponent({ userId }: { userId: string }) {
  // Type safety for a simple user document
  const [writeUser, userLoading, userError] = useWrite(db.users('fsdf' as any));
  
  // Example: update a user profile
  const handleUpdateProfile = async (name: string, bio: string) => {
    try {
      // Type-safe: TypeScript will validate these fields match UserData
      await writeUser({
        name,
        bio
        // Error would occur here if we tried to add a non-existent field
        // invalidField: true <- TypeScript error
      });
      console.log("Profile updated!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Example: add a new comment to a post
  const postId = "post123";
  const [writeComment, commentLoading, commentError] = useWrite(
    db.posts(postId).comments("newComment")
  );

  const addComment = async (content: string) => {
    try {
      // Type-safe: TypeScript ensures we include all required fields
      await writeComment({
        content,
        authorId: db.users.id(userId),
        createdAt: db.serverDate(),
        edited: false
      });
      console.log("Comment added!");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Demonstrating useRead with useWrite
  const [post] = useRead(db.posts(postId).get());
  const [updatePostViews, updateLoading] = useWrite(db.posts(postId));

  useEffect(() => {
    if (post) {
      // Type-safe field increment
      updatePostViews({ 
        viewCount: db.increment(1)
      });
    }
  }, [post?.ref.id]);

  return (
    <div>
      <h1>User Profile</h1>
      {userLoading && <p>Updating profile...</p>}
      {userError && <p>Error: {String(userError)}</p>}
      
      <button onClick={() => handleUpdateProfile("New Name", "New bio")}>
        Update Profile
      </button>
      
      <h2>Add Comment</h2>
      <button onClick={() => addComment("Great post!")}>
        Add Comment
      </button>
    </div>
  );
}

// This would show a type error because the field "nonExistingField" doesn't exist
function InvalidExample() {
  const [writeUser] = useWrite(db.users("user123"));
  
  const handleInvalidUpdate = () => {
    // This would cause a TypeScript error
    writeUser({
      name: "Valid field",
      // @ts-expect-error
      nonExistingField: "This field doesn't exist in the schema"
    });
  };
  
  return <button onClick={handleInvalidUpdate}>Invalid Update</button>;
} 