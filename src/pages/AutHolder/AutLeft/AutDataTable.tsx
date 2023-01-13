import React, { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material";

const AutTable = ({
  apiRef,
  data,
  loading,
  columns,
  onStateChange,
  ...rest
}: any) => {
  const handleDoubleCellClick = useCallback((params, event) => {
    event.defaultMuiPrevented = true;
  }, []);

  const handleCellKeyDown = useCallback((params, event) => {
    if (["Escape", "Delete", "Backspace", "Enter"].includes(event.key)) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const handleCellFocusOut = useCallback((params, event) => {
    if (params.cellMode === "edit" && event) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const AutDataGrid = styled(DataGrid)(({ theme }) => ({
    width: "100%",

    "& .MuiDataGrid-renderingZone": {
      maxHeight: "none !important"
    },
    "& .MuiDataGrid-cell": {
      lineHeight: "unset !important",
      maxHeight: "none !important",
      maxWidth: `200px !important`,
      whiteSpace: "normal"
    },
    "& .MuiDataGrid-row": {
      maxHeight: "none !important"
    }
  }));

  return (
    <div
      className="aut-datatable"
      style={{
        padding: "35px",
        flexGrow: 1
      }}
    >
      <AutDataGrid
        apiRef={apiRef}
        editMode="row"
        loading={loading}
        onCellDoubleClick={handleDoubleCellClick}
        onCellFocusOut={handleCellFocusOut}
        onCellKeyDown={handleCellKeyDown}
        onStateChange={onStateChange}
        hideFooter
        hideFooterPagination
        hideFooterSelectedRowCount
        disableColumnFilter
        showCellRightBorder={false}
        showColumnRightBorder={false}
        disableColumnMenu
        density="comfortable"
        disableColumnSelector
        sx={{
          border: "none",
          color: "white",
          ".MuiInputBase-input": {
            color: "white",
            fontSize: "16px",
            textAlign: "left"
          },
          ".MuiDataGrid-columnHeaders": {
            borderBottom: "2px solid",
            borderColor: "white"
          },
          ".MuiDataGrid-columnSeparator": {
            display: "none"
          },
          ".MuiDataGrid-cell": {
            fontSize: "16px",
            textAlign: "left"
          },
          ".MuiDataGrid-columnHeaderTitle": {
            width: "100%",
            textAlign: "left"
          },
          ".MuiDataGrid-columnHeader": {
            fontSize: "20px"
          }
        }}
        headerHeight={70}
        columns={columns}
        rows={data}
        {...rest}
      />
    </div>
  );
};

const AutDataTable = React.forwardRef((props: any, ref) => (
  <AutTable innerRef={ref} {...props} />
));

export default AutDataTable;
