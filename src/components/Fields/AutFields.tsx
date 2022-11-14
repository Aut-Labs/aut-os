import { DatePicker, CalendarPicker } from "@mui/lab";
import {
  Select,
  SelectProps,
  TextField,
  TextFieldProps,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { pxToRem } from "@utils/text-size";
import { Controller, FieldErrors } from "react-hook-form";

interface FormHelperTextProps {
  errors: FieldErrors<any>;
  name: string;
  children?: string | JSX.Element;
  errorTypes?: any;
  positionAbsolute?: boolean;
  value?: any;
}

const defaultErrorTypes = {
  required: "Field is required!"
};

export function FormHelperText({
  errors,
  name,
  errorTypes,
  children = null,
  value,
  positionAbsolute = true
}: FormHelperTextProps) {
  if (errors[name]) {
    const { type } = errors[name];
    const types = {
      ...defaultErrorTypes,
      ...(errorTypes || {})
    };

    const message = types[type as any];

    return (
      <Typography
        whiteSpace="nowrap"
        color="red"
        align={`${positionAbsolute ? "right" : "center"}`}
        component="span"
        variant="body2"
        className="auto-helper-error"
        sx={{
          width: "100%",
          position: `${positionAbsolute ? "absolute" : "static"}`,
          left: "0",
          ml: pxToRem(20)
        }}
      >
        {message}
      </Typography>
    );
  }
  return (
    children && (
      <Typography
        sx={{
          width: "100%",
          position: "absolute",
          left: "0"
        }}
        className="auto-helper-info"
        color="white"
        align="right"
        component="span"
        variant="body2"
      >
        {children}
      </Typography>
    )
  );
}

export const AutTextField = styled(
  (props: TextFieldProps & { width: string }) => <TextField {...props} />
)(({ theme, width, multiline }) => ({
  width: pxToRem(width),

  "&.MuiTextField-root": {
    width: width.includes("%") ? width : pxToRem(width)
  },
  "&.MuiFormControl-root": {
    marginBottom: "0",
    backgroundColor: theme.palette.background.default
  },
  ".MuiInputLabel-root": {
    top: "-2px"
  },
  ".MuiFormHelperText-root": {
    marginRight: 0,
    marginLeft: 0,
    textAlign: "right",
    position: "relative"
  },
  ".MuiInput-underline": {
    "&:after": {
      borderWidth: "1px",
      transform: "scaleX(1)"
    }
  },
  ".MuiOutlinedInput-root, .MuiInput-underline": {
    color: "#fff",
    fontSize: pxToRem(20),
    ...(!multiline && {
      padding: 0,
      height: pxToRem(50)
    }),
    ".MuiInputBase-input": {
      paddingTop: 0,
      paddingBottom: 0
    },
    "&::placeholder": {
      opacity: 1,
      color: "#707070"
    },
    "&::-webkit-input-placeholder": {
      color: "#707070",
      opacity: 1,
      fontSize: pxToRem(20)
    },
    "&::-moz-placeholder": {
      color: "#707070",
      opacity: 1
    }
  },
  ".MuiOutlinedInput-root": {
    "& > fieldset": {
      borderBottom: "1px solid #439EDD",
      borderWidth: "1px",

      "&.MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
        borderBottom: "1px solid #439EDD"
      }
    },
    "&.Mui-focused fieldset, &:hover fieldset": {
      borderBottom: "1px solid #439EDD",
      borderWidth: "1px !important"
    }
  }
}));

const StyledSelectField = styled((props: SelectProps & { width: string }) => {
  return (
    <Select
      MenuProps={{
        sx: {
          ".MuiPaper-root": {
            borderWidth: "1px !important",
            background: "#141414"
          },
          borderTop: 0,
          "& ul": {
            color: "#000",
            padding: 0
          },
          "& li": {
            fontSize: pxToRem(18),
            color: "white",
            "&:hover:not(.Mui-selected)": {
              backgroundColor: "#009FE3",
              color: "#fff"
            },
            "&.Mui-selected:hover, &.Mui-selected": {
              backgroundColor: "#009FE3",
              color: "#fff"
            }
          }
        }
      }}
      {...props}
    />
  );
})(({ width }) => ({
  ".MuiFormHelperText-root": {
    marginRight: 0,
    marginLeft: 0,
    textAlign: "right",
    position: "relative"
  },
  "&.MuiInput-underline": {
    "&:after": {
      borderWidth: "1px",
      transform: "scaleX(1)"
    }
  },
  "&.MuiOutlinedInput-root, &.MuiInput-underline": {
    width: pxToRem(width),
    ".MuiSelect-select, .MuiSelect-nativeInput": {
      height: "100%",
      display: "flex",
      alignItems: "center"
    },
    color: "#fff",
    padding: 0,
    fontSize: pxToRem(18),
    height: pxToRem(50),
    ".MuiInputBase-input": {
      paddingTop: 0,
      paddingBottom: 0
    },
    ".MuiSvgIcon-root": {
      fontSize: "20px",
      color: "#fff"
    },
    "&::placeholder": {
      opacity: 1,
      color: "#707070"
    },
    "&::-webkit-input-placeholder": {
      color: "#707070",
      opacity: 1,
      fontSize: pxToRem(18)
    },
    "&::-moz-placeholder": {
      color: "#707070",
      opacity: 1
    }
  },
  "&.MuiOutlinedInput-root": {
    fieldset: {
      border: "1px solid #439EDD"
    },
    "&:hover fieldset": {
      border: "2px solid #439EDD"
    },
    ".MuiSelect-select, .MuiSelect-nativeInput": {
      justifyContent: "center"
    }
  }
}));

const SelectWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginBottom: pxToRem(45),
  position: "relative",
  ".auto-helper-info, .auto-helper-error": {
    bottom: "-18px"
  }
});

interface AutSelectProps extends Partial<SelectProps> {
  width: string;
  helperText: JSX.Element;
}
export const AutSelectField = ({ helperText, ...props }: AutSelectProps) => {
  return (
    <SelectWrapper>
      <StyledSelectField {...props} />
      {helperText}
    </SelectWrapper>
  );
};
