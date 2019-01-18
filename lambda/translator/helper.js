exports.changeStatusTo = function (status, uuid) {
    return {
      TableName: "PROCESS_STORAGE",
      Key: {
          "PROCESS_ID": uuid
      },
      UpdateExpression: "set PROCESS_STATUS = :p",
      ExpressionAttributeValues: {
          ":p": status,
      },
      ReturnValues: "UPDATED_NEW"
  };
};