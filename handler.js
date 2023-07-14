'use strict';

const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.createCourse = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body);

    const params = {
      TableName: 'courses',
      Item: {
        courseId: event.requestContext.requestId,
        title,
        description,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Course created successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to create course' }),
    };
  }
};

module.exports.getCourses = async () => {
  try {
    const params = {
      TableName: 'courses',
    };

    const result = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch courses' }),
    };
  }
};


module.exports.getCourse = async (event) => {
  try {
    const { courseId } = event.pathParameters;

    const params = {
      TableName: 'courses',
      Key: {
        courseId,
      },
    };

    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Course not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to retrieve course' }),
    };
  }
};

module.exports.updateCourse = async (event) => {
  try {
    const { courseId } = event.pathParameters;
    const { title, description } = JSON.parse(event.body);

    const params = {
      TableName: 'courses',
      Key: {
        courseId,
      },
      UpdateExpression: 'set title = :title, description = :description',
      ExpressionAttributeValues: {
        ':title': title,
        ':description': description,
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Course updated successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update course' }),
    };
  }
};

module.exports.deleteCourse = async (event) => {
  try {
    const { courseId } = event.pathParameters;

    const params = {
      TableName: 'courses',
      Key: {
        courseId,
      },
    };

    await dynamoDB.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Course deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete course' }),
    };
  }
};
