import { Form, Input, message, Progress, Rate } from "antd";
import React, { useEffect, useState } from "react";
import { FaArrowDown, FaReply, FaTrash } from "react-icons/fa";
import user from "../../../images/user.png";
import { useI18n } from "../../providers/i18n";
import Avatar from "../common/Avatar";
import dayjs from "dayjs";
import { useAction, useActionConfirm, useFetch } from "../../helpers/hooks";
import {
    deleteBlogComment,
    fetchBlogComments,
    postBlogComment,
} from "../../helpers/backend";
import { useUser } from "../../context/user";
import { useModal } from "../../context/modalContext";

const BlogComment = ({ blogId, comments }) => {
    const [data, getData, { loading }] = useFetch(fetchBlogComments, {
        blog_id: blogId,
    });
    const { user } = useUser();
    const i18n = useI18n();
    const [comment, setComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const { openLoginModal ,isLoginModalOpen, closeLoginModal} = useModal();
    useEffect(() => {
        getData({ blog_id: blogId });
    }, [blogId]);
    const handleReplyClick = (commentId) => {
        setReplyingTo(commentId);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyContent("");
    };

    const handleReplySubmit = async (e) => {
        if (replyContent === "") {
            message.error("Please enter a reply");
            return;
        }
        if (!user) {
            openLoginModal();
            return;
        }
        // Handle form submission logic here
        await useAction(
            postBlogComment,
            {
                content: replyContent,
                blog_id: blogId,
                parent_id: e,
            },
            getData,
            false,
            "Reply added successfully"
        );
        setComment("");
        setReplyingTo(null);
        setReplyContent("");
    };

    const handleChange = (e) => {
        setComment(e.target.value); // Update the state with the textarea value
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        if (comment === "") {
            message.error("Please enter a comment");
            return;
        }
        if (!user) {
            openLoginModal();
            return;
        }
        // Handle form submission logic here
        await useAction(
            postBlogComment,
            {
                content: comment,
                blog_id: blogId,
            },
            getData,
            false,
            "Comment added successfully"
        );
        setComment("");
    };
    const handleDeleteComment = (e) => {
        useActionConfirm(
            deleteBlogComment,
            {
                blog_id: blogId,
                id: e,
            },
            getData,
            false,
            "Comment deleted successfully"
        );
    };
    return (
        <div className="rounded-2xl border-breadcrumb mt-10">
            <div className="space-y-6 bg-[#FBF1E3] border-2 border-dashed border-text rounded-[20px] p-6 md:p-[60px]">
                <div className="rounded-lg mb-8">
                    <h3 className="midtitle text-text !font-bold mb-4">
                        {i18n.t("Comments")} ({data?.length || 0})
                    </h3>
                    <div className="space-y-6">
                        {data?.map((comment) => (
                            <div
                                key={comment?.id}
                                className="border-b-2 last:border-b-0 border-dashed border-text pb-8 last:pb-0"
                            >
                                <div className="pb-8 last:pb-0">
                                    <div className="flex items-start gap-3">
                                        {comment?.user?.image ? (
                                            <img
                                                src={comment?.user?.image}
                                                alt={comment?.user?.name}
                                                className="w-10 md:w-[70px] h-10 md:h-[70px] rounded-xl border-2 border-text border-dashed"
                                            />
                                        ) : (
                                            <Avatar
                                                classes="w-[50px] h-[50px] rounded-full lg:text-[30px] text-[20px]"
                                                name={comment?.user?.name}
                                            />
                                        )}

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="midtitle text-text !font-bold">
                                                            {
                                                                comment?.user
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-sm text-gray-500">
                                                            {dayjs(
                                                                comment?.created_at
                                                            ).format(
                                                                "MMM [at] h.mma"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="header-description tracking-widest !text-base !text-text">
                                                        {comment?.content}
                                                    </p>
                                                </div>
                                               {user?.id === comment?.user?.id && (<div>
                                                    <FaTrash
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment?.id
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-primary hover scale-105 duration-300 cursor-pointer"
                                                    />
                                                </div>)
                                                }
                                            </div>

                                            {/* Recursive Replies Rendering */}
                                            {comment?.replies &&
                                                comment.replies.length > 0 && (
                                                    <div className="ml-7">
                                                        {comment.replies.map(
                                                            (reply) => (
                                                                <CommentComponent
                                                                    key={
                                                                        reply?.id
                                                                    }
                                                                    comment={
                                                                        reply
                                                                    }
                                                                    handleDeleteComment={
                                                                       handleDeleteComment
                                                                    }
                                                                    handleReplyClick={
                                                                        handleReplyClick
                                                                    }
                                                                    handleReplySubmit={
                                                                        handleReplySubmit
                                                                    }
                                                                    handleCancelReply={
                                                                        handleCancelReply
                                                                    }
                                                                    replyingTo={
                                                                        replyingTo
                                                                    }
                                                                    replyContent={
                                                                        replyContent
                                                                    }
                                                                    setReplyContent={
                                                                        setReplyContent
                                                                    }
                                                                    user={user}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            {/* Reply Button */}
                                            <div className="flex justify-between items-center mt-2">
                                                <button
                                                    className="text-sm flex items-center gap-2 text-gray-500 hover:text-gray-700"
                                                    onClick={() =>
                                                        handleReplyClick(
                                                            comment?.id,
                                                            false
                                                        )
                                                    }
                                                >
                                                <FaReply />

                                                    Reply
                                                </button>
                                            </div>

                                            {/* Reply Form */}
                                            {replyingTo === comment?.id && (
                                                <Form
                                                    className="mt-4"
                                                    onFinish={() =>
                                                        handleReplySubmit(
                                                            comment?.id
                                                        )
                                                    }
                                                >
                                                    <Input
                                                        rows={4}
                                                        className="py-3 border-2 border-text rounded-lg border-dashed"
                                                        value={replyContent}
                                                        onChange={(e) =>
                                                            setReplyContent(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Write your reply..."
                                                    />
                                                    <div className="flex justify-end items-end gap-2 mt-2">
                                                        <button
                                                            type="submit"
                                                            className="bg-primary text-white md:px-6 px-4 header-description py-1 sm:py-3 rounded"
                                                        >
                                                            Comment
                                                        </button>
                                                        <button
                                                            className="bg-primary text-white md:px-6 px-4 header-description py-1 sm:py-3 rounded"
                                                            onClick={
                                                                handleCancelReply
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* {visibleComments < comments.length && (
            <div className="flex justify-end items-end text-center mt-4">
              <button className='bg-primary text-white md:px-8 px-5 header-description py-1 sm:py-3 rounded flex items-center gap-2' onClick={handleShowMore}>
                Show More <FaArrowDown />
              </button>
            </div>
          )} */}
                    </div>
                </div>

                {/* Comment Form */}
                <div>
                    <div className="midtitle text-breadcrumb !font-normal mb-4">
                        {i18n.t("Give your opinion")}!
                    </div>
                    <form
                        className="1xl:space-y-10 space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <div className="w-full ">
                            <textarea
                                placeholder="Comment"
                                name="comment"
                                value={comment} // Bind value to state
                                onChange={handleChange} // Capture input changes
                                className="p-5 w-full border-[1px] border-primary 1xl:h-[300px] h-[200px] rounded-xl z-50"
                                style={{
                                    outline: "none",
                                }}
                            />
                        </div>
                        <button type="submit" className="kids-button">
                            {i18n.t("Submit")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogComment;
const RenderReplies = ({ replies }) => {
    if (!replies || replies.length === 0) return null; // Guard clause

    return (
        <div className="ml-7">
            {replies.map((reply) => (
                <div key={reply.id} className="my-4">
                    <div className="flex items-start gap-3">
                        {reply?.user?.image ? (
                            <img
                                src={reply.user.image}
                                alt={reply.user.name}
                                className="w-10 md:w-[70px] h-10 md:h-[70px] rounded-xl border-2 border-text border-dashed"
                            />
                        ) : (
                            <Avatar
                                classes="w-[50px] h-[50px] rounded-full lg:text-[30px] text-[20px]"
                                name={reply.user.name}
                            />
                        )}
                        <div className="flex-1">
                            {/* User Name */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="midtitle text-text !font-bold">
                                    {reply.user.name}
                                </span>
                            </div>

                            {/* Created Time */}
                            <div className="flex gap-2 items-center">
                                <span className="text-sm text-gray-500">
                                    {dayjs(reply.created_at).format(
                                        "MMM [at] h.mma"
                                    )}
                                </span>
                            </div>

                            {/* Reply Content */}
                            <p className="header-description tracking-widest !text-base !text-text">
                                {reply.content}
                            </p>

                            {/* Reply Button */}
                            <button
                                className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                                onClick={() => handleReplyClick(reply.id)}
                            >
                                Reply
                            </button>

                            {/* Recursive Call for Nested Replies */}
                            {reply.replies && reply.replies.length > 0 && (
                                <RenderReplies replies={reply.replies} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CommentComponent = ({
    comment,
    depth = 0,
    maxDepth = 3,
    handleDeleteComment,
    handleReplyClick,
    handleReplySubmit,
    handleCancelReply,
    replyingTo,
    replyContent,
    setReplyContent,
    user
}) => {
    // Limit nesting depth
    if (depth >= maxDepth) {
        return null;
    }

    return (
        <div
            key={comment?.id}
            className={`
                border-l-2 border-dashed border-gray-200
                ${depth > 0 ? "pl-4" : "pl-2"}
                max-h-[300px] overflow-y-auto
            `}
        >
            <div className="pb-4">
                <div className="flex items-start gap-3">
                    {comment?.user?.image ? (
                        <img
                            src={comment?.user?.image}
                            alt={comment?.user?.name}
                            className="w-8 h-8 rounded-xl border-2 border-text border-dashed"
                        />
                    ) : (
                        <Avatar
                            classes="w-8 h-8 rounded-full text-[14px]"
                            name={comment?.user?.name}
                        />
                    )}

                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-text">
                                        {comment?.user?.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {dayjs(comment?.created_at).format(
                                            "MMM [at] h.mma"
                                        )}
                                    </span>
                                </div>
                                <p className="text-sm text-text mt-1">
                                    {comment?.content}
                                </p>
                            </div>
                           { user?.id === comment?.user?.id &&  (<div>
                                <FaTrash
                                    onClick={() =>
                                        handleDeleteComment(comment?.id)
                                    }
                                    className="text-gray-400 hover:text-primary hover:scale-105 duration-300 cursor-pointer text-sm"
                                />
                            </div>)
                           }
                        </div>

                        {/* Recursive Replies Rendering */}
                        {comment?.replies && comment.replies.length > 0 && (
                            <div className="mt-2 ml-2 ">
                                {comment.replies.map((reply) => (
                                    <CommentComponent
                                        key={reply?.id}
                                        comment={reply}
                                        depth={depth + 1}
                                        maxDepth={maxDepth}
                                        handleDeleteComment={
                                            handleDeleteComment
                                        }
                                        handleReplyClick={handleReplyClick}
                                        handleReplySubmit={handleReplySubmit}
                                        handleCancelReply={handleCancelReply}
                                        replyingTo={replyingTo}
                                        replyContent={replyContent}
                                        setReplyContent={setReplyContent}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Reply Button */}
                        {depth < maxDepth - 1 && (
                            <div className="flex justify-start items-center mt-2">
                                <button
                                    className="text-xs flex items-center gap-2 text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                        handleReplyClick(comment?.id, false)
                                    }
                                >
                               <FaReply />

                                    Reply
                                </button>
                            </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === comment?.id && (
                            <Form
                                className="mt-2"
                                onFinish={() => handleReplySubmit(comment?.id)}
                            >
                                <Input
                                    rows={3}
                                    className="text-sm py-2 border-2 border-text rounded-lg border-dashed"
                                    value={replyContent}
                                    onChange={(e) =>
                                        setReplyContent(e.target.value)
                                    }
                                    placeholder="Write your reply..."
                                />
                                <div className="flex justify-end items-center gap-2 mt-2">
                                    <button
                                        type="submit"
                                        className="text-xs bg-primary text-white px-3 py-1 rounded"
                                    >
                                        Comment
                                    </button>
                                    <button
                                        type="button"
                                        className="text-xs bg-primary text-white px-3 py-1 rounded"
                                        onClick={handleCancelReply}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
